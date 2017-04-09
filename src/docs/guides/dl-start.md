# Recipe Part 1: (Re-)Training a Model

Now that you understand deep learning models and training methods, let's get coding. We'll going to an iPhone app which will take the camera input and decide whether the camera is looking at a business card.

In Part 1, we're going to train and then re-train a model using our own data set using Clarifai and TensorFlow.
In Part 2, we'll hook up our model to an iPhone app.

You might have already seen Clarifai in action in the Vision section. A slightly more advanced use of Clarifai's Web service is to feed it our own data to train a model. We'll do that, and then try the same thing in Google's TensorFlow.

# Clarifai Retraining

Clarifai provides a straightforward system to add data and train models. Here's how:

1. Upload images with labels (which Clarifai call "concepts").
2. Create and train a model for the inputs.
3. Use the model for prediction.

Note that in the command samples that follows, `CLARIFAI_ACCESS_TOKEN` is a token that can be obtained either programmatically via API calls or directly from the developer console. Tokens expire and must be renewed frequently.

## Adding inputs and concepts

The steps in the retraining script involve first adding inputs and concepts, sending information for images with their respective labels:

```

  curl -X POST \
    -H 'Authorization: Bearer CLARIFAI_ACCESS_TOKEN' \
    -H "Content-Type: application/json" \
    -d '
    {
      "inputs": [
        {
          "data": {
            "image": {
              "url": "sourcesite/business_card/001.jpg"
            },
            "concepts":[ { "id": "business_card", "value": true }, { "id": "credit_card", "value": false } ]
          }
        }
      ]
    }'\
    https://api.clarifai.com/v2/inputs
```

## Create and Train The Model

Once the inputs and concepts have been added, we create the model with an ID, in this example `ccs1`

```

curl -X POST \
    -H 'Authorization: Bearer CLARIFAI_ACCESS_TOKEN' \
    -H "Content-Type: application/json" \
    -d '
    {
      "model": {
        "name": "ccs",
        "id": "ccs1",
        "output_info": {
          "data": {
            "concepts": [
              {
                "id": "business_card",
                "name": "business card"
              },
              {
                "id": "credit_card",
                "name": "credit card"
              }
            ]
          },
          "output_config": {
            "concepts_mutually_exclusive": false,
            "closed_environment":false
          }
        }
      }
    }'\
    https://api.clarifai.com/v2/models
```


and can then train the model with

```
curl -X POST \
  -H 'Authorization: Bearer CLARIFAI_ACCESS_TOKEN' \
  -H "Content-Type: application/json" \
  https://api.clarifai.com/v2/models/ccs1/versions
```

After the training has started and the script ends, you can check the status of the training with

```
 curl -X GET   -H 'Authorization: Bearer CLARIFAI_ACCESS_TOKEN'   -H "Content-Type: application/json"   https://api.clarifai.com/v2/models/ccs1/output_info
```

Note that model operations include the model ID within the URL, `https://api.clarifai.com/v2/models/MODEL_ID/output_info`.

Once this is done, you can ask the model to make a prediction to pasing in the Model ID to reference the model we should trained.

# TensorFlow

Now let's do the same thing in TensorFlow. We will first prepare and train a standard model and then retrain it with our data set. This recipe will take some more effort because we're downloading TensorFlow software onto our own development machine. 

## TensorFlow Ingredients

At a high level, here's what we'll need to build the model:

* A modern Mac, running macOS 10.11 or above, with 8GB+ of RAM, 50-100 GB of free disk space, and a fast Internet connection
* An iPhone
* TensorFlow
* A training dataset. We selected the [Stanford Mobile Dataset](/reference-material/chandrasekhar2011stanford.pdf) to use as a basis and augmented that with additional images as we'll see below.

Using these tools, we will train a model to recognize between two categories of items: "business card" and other similar items you might find on a desk that have similar visual structure, like books, CD covers and credit cards. With the model in hand, we'll be able to process images obtained from the iPhone camera in real time and, when appropriate, perform text extraction/recognition from those images.

## To Tutorial or not to Tutorial?

We explicitly did not want this survey to become a tutorial or set of tutorials, but we _did_ want to provide a quick path for those interested to try things out and get an idea of how different technologies worked or what they could do. In the case of Deep Learning we will have to make a bit of an exception and go into tutorial mode for a bit.

The reason is simple: there are many, _many_, guides for installing, testing, and developing with TensorFlow, Theano, and other frameworks. It's not really lack of material that can be a problem for newcomers, but rather the somewhat chaotic and frequently outdated information you'll find that makes things difficult. Add to that many unscrupulous websites that have taken to copying tutorials outright just to steal traffic off of a "hot" set of search keywords, and you can find yourself spending many hours trying to get even basic things to work.

Let's be clear -- this is not a criticism of any of the projects or their extraordinary efforts to package and document very complex technology in a way that allows non-experts to use it effectively. It is simply the result of a combination of a huge amount of activity, and the chaos that creates, and untold copies, revisions, and simply evolution getting in the way.

**An important aside on tutorials** if you're a practitioner of Computer Science/Engineering, you might be tempted to skip over some tutorials like "Deep Learning for Poets", since, well... you are probably not a poet. A word of advice: don't. The structure and contents of those tutorials 'for poets' is indeed designed to help someone with little programming experience, but the underlying complexity of the tasks involved means that a single mistake, or a single component out of date, and you've got an error that is very hard to decipher. Reading through and using the more basic tutorials will also help you get comfortable with the various tools.

So, with all that in mind, let's take a look at how to setup TensorFlow and use it to solve a specific problem.

TensorFlow in particular is one of the most active deep learning packages, and there are many tutorials available for it. We strongly encourage you to spend some time getting acquainted with them if possible:

* [Get Started](https://www.tensorflow.org/get_started/) and [Tutorials](https://www.tensorflow.org/tutorials/) from tensorflow.org.
* [Deep Learning for Poets](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets/) a Google Codelab, originally developed by [Peter Warden](https://petewarden.com/2016/02/28/tensorflow-for-poets/).
* [TensorFlow APIs](https://www.tensorflow.org/api_docs/) (C++ and Python).
* [Setup Instructions](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/g3doc/get_started/os_setup.md) from the [TensorFlow github repository](https://github.com/tensorflow/tensorflow).

**The instructions that follow are a combination of material on those tutorials** making a few specific choices to simplify (some) things along the way. We hope it can make things a bit easier if you are having problems following other tutorials or unsure of which option to choose.

While the credit should go entirely to those that created the tutorials and software, any mistakes in this document are likely our own. If you find some, [please let us know!](/contact/).


## If You Already Have TensorFlow Installed

If you are already familiar with TensorFlow and reuse/retraining of models, and just want to skip over to our example, you can jump directly to [Setup and Test the iOS App](/docs/reference/dl-app#setupiOS).


## Installing TensorFlow on Mac OS X

Before we begin: you will need install/sudo privileges (or the Administrator/root password for your machine). If you aren't sure what these are but still want to try out the tutorial... we commend you! But first, please talk to someone in the IT department. :)

For even the simplest tasks involving deep learning (e.g. preparing the environment, running tests) and training models, you will need a modern machine and a fast Internet connection:

* 8 GB of RAM, preferably 16+ GB.
* About ~100 GB of free disk space to be comfortable, 50 GB of free space is probably the bare minimum you'll need.
* An Internet connection of 50+ Mbps is strongly recommended, failing that: a lot of patience. If you are using your Internet connection at work many sites may be blocked, keep this in mind if you're seeing problems.

Why these requirements? There are a few packages that you need to install that represent downloads of 4+ GB (eg. Xcode). In addition to that there are other elements that either the tools or TensorFlow will need to download, and those easily add up (if you want to install GPU support, the nVidia installer alone is over 1 GB in size, data sample sets are usually several hundreds of MB in size, etc).

**Note I:** In all that follows, lines of code that start with '$' are Terminal commands. The `$` sign is the command prompt, and in your system it may be different, for example it may include your name and your machine's network name, as in `joe@mylaptop:~$`. What you need to copy and paste is everything after the `$` sign in the examples.

**Note II:** experienced readers will quickly see that these instructions are for building TensorFlow from source. While that is generally seen as the most 'advanced' option, and is certainly the one that takes more time, it has been our experience that the various pre-packaged installs that exist can be fickle, particularly for libraries or Python components, so while this path will take longer than most others, it should be less.

Let's get to it!

### <a name="openTerminal"></a>0. Open Terminal

You can open terminal by either opening Spotlight Search and typing in `terminal` or looking in `/Applications/Utilities/`. For all the commands that follow we will assume that you're using the default shell (bash). If you are using a different shell, chances are you don't need this tutorial. :)

Throughout other guides you may see path references like `$HOME/somefolder` or `~/tensorflow`. The `$HOME` environment variable and tilder `~` both refer to your _home directory_ on the Terminal. So for a user named Joe, `~/tensorflow` will translate to something like `/Users/joe/tensorflow`.

**A note on paths and folders***: For the examples that follow we will assume that we are user `joe` in the machine, and that we've installed everything in joe's home directory, at

```
/Users/joe/
```

Whenever you see `/Users/joe/` you will have to replace it with your own home path. Some of the commands don't recognize references like `~/` or `$HOME` and in general if you are not familiar with BASH it's better to avoid anything that might create issues, so the least-problematic option is simply to reference to full paths for file or folder locations.

### 1. Install Xcode 8 & Command Line Tools

To develop on mac you'll need to first make sure you have developer tools installed. Xcode 8 is [free to install](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) on the Mac App Store. Install that first. It's about a 4GB download and will take over 10 GB of disk space once installed.

Once it's installed, run it once to verify & accept the license, then close it. Afterwards, in the terminal, run:

```
$ sudo xcode-select --install
```

This will install the command line tools, which are a necessary component for what we'll do next (You might be asked to install the command line tools when opening Xcode).

**IMPORTANT** -- if you already have Xcode 7 or earlier (but not 8) and you haven't installed Homebrew, _don't skip this step_, you will need to install Xcode 8. After the Homebrew install we'll cover how to install Xcode 7 side-by-side with 8 and use them when appropriate.

### 2. Install Homebrew, Bazel and Python packages

Homebrew is a free, open source package manager for the Mac. Bazel is a _command line build tool_ that is not specific to TensorFlow. Python is one of the programming languages used by TensorFlow, and while your Mac comes with Python out of the box, you will probably need to add some packages to it.

**Homebrew**

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Homebrew now includes anonymous user analytics to help them with development and features, but disabling them is straightforward by running

```bash
$ brew analytics off
```

After the Homebrew install has finished. See the [Homebrew Analytics doc](https://github.com/Homebrew/brew/blob/master/docs/Analytics.md) for more information

**Java**

A part of the build system we'll use ([Bazel](https://www.bazel.io/)) uses the Java Runtime Environment for some of its tasks. Since that is no longer included in factory installs on Macs, you may need to install it yourself.

First, check if you have it. In the terminal, run:

```bash
$ java -version
```

If the output is something like
```bash
$ java -version
java version "1.8.0_92"
Java(TM) SE Runtime Environment (build 1.8.0_92-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.92-b14, mixed mode)
```

Then you are ok. If the version number is lower than `1.8` you'll need to upgrade it or reinstall, depending on your system.

If the result is

```bash
$ java -version
-bash: java: command not found
```

Then you'll need to install it. Luckily, Homebrew provides a way to do it easily using [Homebrew Cask](https://caskroom.github.io/).

```bash
$ brew tap caskroom/cask
$ brew cask install java
```

<style>.toggle-java-accordion:before { content:'Show Java Install Output' } .toggle-accordion[aria-expanded="true"]:before { content:'Hide Java Install Output'; }</style>

<small><button data-toggle="collapse" data-target="#java-setup" class="toggle-java-accordion"></button></small>

<div id="java-setup" class="collapse">

```bash
==> Creating Caskroom at /usr/local/Caskroom
==> We'll set permissions properly so we won't need sudo in the future
Password:
==> Caveats
This Cask makes minor modifications to the JRE to prevent issues with
packaged applications, as discussed here:

  https://bugs.eclipse.org/bugs/show_bug.cgi?id=411361

If your Java application still asks for JRE installation, you might need
to reboot or logout/login.

Installing this Cask means you have AGREED to the Oracle Binary Code
License Agreement for Java SE at

  https://www.oracle.com/technetwork/java/javase/terms/license/index.html

==> Downloading http://download.oracle.com/otn-pub/java/jdk/8u112-b16/jdk-8u112-macosx-x64.dmg
######################################################################## 100.0%
==> Verifying checksum for Cask java
==> Running installer for java; your password may be necessary.
==> Package installers may write to any location; options such as --appdir are ignored.
Password:
==> installer: Package name is JDK 8 Update 112
==> installer: Installing at base path /
==> installer: The install was successful.
🍺  java was successfully installed!
```
</div>

**Bazel**

```bash
$ brew install bazel
https://bazel.build/versions/master/docs/install.html#mac-os-x
```

Once installed, you can upgrade to newer version of Bazel with:

```bash
$ brew upgrade bazel
```

**Python Packages**

```bash
$ sudo easy_install -U six
$ sudo easy_install -U numpy
$ sudo easy_install wheel
$ sudo easy_install ipython
```

Note: If you encounter issues installing/running homebrew or bazel, check the [errors FAQ](/docs/guides/dl-errors-faq#brew_bazel) for possible solutions.

<style>.toggle-accordion:before { content:'Show GPU Setup Steps' } .toggle-accordion[aria-expanded="true"]:before { content:'Close GPU Setup Steps'; }</style>

### 2a. Advanced: Setup GPU for Mac

TensorFlow and other deep learning libraries support using your GPU (the CPU of your graphics card) for computation. While most tutorials refer to GPU setup as "optional" it's better to consider it as something that you can add _after_ you have gotten everything else running. While the promise of faster results may be tempting, GPU support is difficult to setup and to maintain due to the large number of GPUs available and the need to install software that is frequently experimental.

<small><button data-toggle="collapse" data-target="#mac-gpu-setup" class="toggle-accordion"></button></small>

<div id="mac-gpu-setup" class="collapse">

<p>To build with GPU support you will need GNU coreutils installed via homebrew:</p>

```bash
$ brew install coreutils
```

<p>You will also need recent the nVidia toolkit.</p>

<p>For macOS 10.11 (El Capitan) and earlier this can be installed via Homebrew as follows:</p>

```bash
$ brew tap caskroom/cask
$ brew cask install cuda
```

<p>For macOS Sierra 10.12 you will be better off installing directly from nVidia at <a href="https://developer.nvidia.com/cuda-downloads">https://developer.nvidia.com/cuda-downloads</a><p>

Once you have the CUDA Toolkit installed you will need to setup the required environment variables by running:

```bash
export CUDA_HOME=/usr/local/cuda
export DYLD_LIBRARY_PATH="$DYLD_LIBRARY_PATH:$CUDA_HOME/lib"
export PATH="$CUDA_HOME/bin:$PATH"
```

(you might also want to add them to `~/.bash_profile`).

Finally, you will also need the CUDA Deep Neural Network (cuDNN v5) library which currently requires a <a href='https://developer.nvidia.com/accelerated-computing-developer'>nVidia Accelerated Computing Developer Program</a> account which can be obtained for free. Once you've <a href='https://developer.nvidia.com/accelerated-computing-developer'>registered</a> and you have confirmed your email and set up your password, you'll have to visit the cuDDN page at <a href='https://developer.nvidia.com/cudnn'>https://developer.nvidia.com/cudnn</a>, which includes access to the <a href='https://developer.nvidia.com/rdp/cudnn-download'>download for cuDNN</a>.

Once you have downloaded and extracted the archive file (usually a <code>.tgz</code> file) skip over any additional nVidia instructions. You can then move the header and libraries to your local CUDA Toolkit folder:

```bash
$ sudo mv include/cudnn.h /Developer/NVIDIA/CUDA-8.0/include/
$ sudo mv lib/libcudnn* /Developer/NVIDIA/CUDA-8.0/lib
$ sudo ln -s /Developer/NVIDIA/CUDA-8.0/lib/libcudnn* /usr/local/cuda/lib/
```

To verify the CUDA installation, you can build and run the nVidia CUDA samples from your home directory (warning: build of all samples can take over an hour on most machines):

```bash
$ cp -r /usr/local/cuda/samples /Users/joe/cuda-samples
$ pushd /Users/joe/cuda-samples
$ make
$ popd
$ /Users/joe/cuda-samples/bin/x86_64/darwin/release/deviceQuery
```

</div>

### 3. Clone Repository and Configure

Now, clone release 0.12 of the tensorflow repository in your home directory (over 130 MB total when downloaded) by running:

```bash
$ git clone -b r0.12 https://github.com/tensorflow/tensorflow
```

Then run the configure script:

```bash
$ cd /Users/joe/tensorflow
$ ./configure
```

For our purposes we will use defaults for all values, so simply press `<ENTER>` for every option.

```
Please specify the location of python. [Default is /usr/bin/python]: <ENTER>
Do you wish to build TensorFlow with Google Cloud Platform support? [y/N] <ENTER>
No Google Cloud Platform support will be enabled for TensorFlow
Do you wish to build TensorFlow with Hadoop File System support? [y/N] <ENTER>
No Hadoop File System support will be enabled for TensorFlow
Found possible Python library paths:
  /Library/Python/2.7/site-packages
Please input the desired Python library path to use.  Default is [/Library/Python/2.7/site-packages]

Using python library path: /Library/Python/2.7/site-packages
Do you wish to build TensorFlow with OpenCL support? [y/N]  <ENTER>
No OpenCL support will be enabled for TensorFlow
Do you wish to build TensorFlow with GPU support? [y/N]  <ENTER>
No GPU support will be enabled for TensorFlow
Configuration finished
..........
INFO: Starting clean (this may take a while). Consider using --expunge_async if the clean takes more than several minutes.
..........
INFO: All external dependencies fetched successfully.
```

If you're building with GPU support, use the GPU data from https://developer.nvidia.com/cuda-gpus to determine which configurations to use.

### 4. Build!

Even though we're building from source, we are still building a package to install using Python's pip. The build process will take no less than 20 minutes and may take over an hour on older machines.

```bash
$ bazel build -c opt //tensorflow/tools/pip_package:build_pip_package
```

If you want to restrict the amount of memory used when compiling to continue using the machine, you can instead run the command with resource settings. For example, to use only 2 GB of RAM max, you can run:

```bash
$ bazel build --local_resources 2048,.5,1.0 -c opt //tensorflow/tools/pip_package:build_pip_package
```

Once compiled, we need to build the install package:

```bash
$ bazel-bin/tensorflow/tools/pip_package/build_pip_package /tmp/tensorflow_pkg
```

which we then use to actually install TensorFlow:

```bash
$ sudo pip install /tmp/tensorflow_pkg/tensorflow-0.12.0rc1-py2-none-any.whl
```

Note that the name of the .whl file will depend on your machine and OS version (In our particular test machine, the resulting filename was `tensorflow-0.12.0rc1-cp27-cp27m-macosx_10_12_intel.whl`).

### 4. Test Your TensorFlow Setup

Neural Networks use what's called a "model" to interpret input and generate outputs. During training, this model is modified by adjusting weights on individual nodes as we discussed previously. Once the model is trained, it can be copied and used without the need for the full TensorFlow setup, which allows you to maintain different models and compare them if that's what you need.

Training a model from scratch is a difficult task. There are many, _many_ variables to consider and testing variations takes a long time, even in fast systems. However, it is possible to use portions of a model while only _retraining_ specific layers.

In this case, to test our TensorFlow setup we will use an example provided in the [TensorFlow retraining section](https://www.tensorflow.org/versions/master/how_tos/image_retraining/index.html) and [TensorFlow for Poets](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets) sites. We will use partial retraining, as described in [DeCAF: A Deep Convolutional Activation Feature for Generic Visual Recognition](/reference-material/donahue2014decaf.pdf), which uses a model that's already trained to classify still images and retrains only the 'top' layer so it recognizes different images categories and labels them correctly. This isn't as effective as a full training approach, but it's fairly effective and relatively fast.

To prepare and test our setup, we will start with the example's own dataset. We will download the training data and source images by running the following commands in the Terminal app:

```bash
cd /Users/joe/
mkdir tf_files
cd tf_files
curl -O http://download.tensorflow.org/example_images/flower_photos.tgz
tar xzf flower_photos.tgz
open flower_photos
```
This should end with a Finder window open in that directory where you can see subfolders for each category (label) of images we'll classify.

**Retraining**

Starting at this step is where all our previous work building from source will pay off. Many of the TensorFlow examples assume that you have your repository configured in a specific way or depend on pre-installed settings in Virtual Machines. By building from source we now have everything ready to build the necessary retraining tools in a consistent environment.

After downloading the data, we will be building (compiling) certain tools and then running them on the dataset.

```bash
$ cd /Users/joe/tensorflow
$ bazel build -c opt --copt=-mavx tensorflow/examples/image_retraining:retrain
```

This process will take a minimum of 15 minutes. At the end, we'll have a new executable to run. As before, you can safely ignore warnings you'll see during the compilation process (And there will be a LOT! But, again, do not worry).

Once compiled, you will be able to run the following command:

```bash
$ bazel-bin/tensorflow/examples/image_retraining/retrain \
--bottleneck_dir=/Users/joe/tf_files/bottlenecks \
--model_dir=/Users/joe/tf_files/inception \
--output_graph=/Users/joe/tf_files/retrained_graph.pb \
--output_labels=/Users/joe/tf_files/retrained_labels.txt \
--image_dir /Users/joe/tf_files/flower_photos
```

What's with the backslashes at the end? It's what's used to create a **multiline** bash command to make it easier to read. Adding a line in bash only requires to type a backslash and then press `<ENTER>` to continue typing below.

The previous command will:

* Automatically download the neural network training model (named "Inception") if you don't already have it
* Use the images in the folder `/Users/joe/tf_files/flower_photos` to retrain the classifier
* Output the resulting retrained graph into the file `/Users/joe/tf_files/retrained_graph.pb`

This process will take 30 minutes or longer, depending on the speed of your machine. As the training progresses you will see a large amount of printouts, and eventually you'll see references to cross entropy and expected accuracy, for example:

```
2016-11-08 21:29:47.104545: Step 3700: Train accuracy = 99.0%
2016-11-08 21:29:47.104596: Step 3700: Cross entropy = 0.067154
2016-11-08 21:29:47.165254: Step 3700: Validation accuracy = 98.0% (N=100)
```

Please note that the actual numbers will differ. The lower the cross entropy and the higher the accuracy, the better the results will be. Keep in mind that these numbers will fluctuate. So between steps you may see an increase in entropy or decrease in accuracy -- this is normal.

Once we have retrained the model, we can test how it works. First we need to build a command line tool for running the test:

```bash
$ bazel build tensorflow/examples/label_image:label_image
```

After that's done, we are ready. The best way is to use an image not present in the dataset. For that, search "daisy photos", pick one image (make sure it's in JPEG format) and download it to, for example, `/Users/joe/tf_files/daisy_test_01.jpg`.

```bash
bazel-bin/tensorflow/examples/label_image/label_image \
--output_layer=final_result \
--labels=/Users/joe/tf_files/retrained_labels.txt \
--graph=/Users/joe/tf_files/retrained_graph.pb \
--image=/Users/joe/tf_files/daisy_test_01.jpg
```

Note that we are referencing the retrained files we generated in the previous step `/Users/joe/tf_files/retrained_graph.pb`.

If all goes well, you should see output that indicates which label the network has selected, something like:

```
$ bazel-bin/tensorflow/examples/label_image/label_image --output_layer=final_result --labels=/Users/joe/tf_files/retrained_labels.txt --graph=/Users/joe/tf_files/retrained_graph.pb --image=/Users/joe/tf_files/daisy_test_01.jpg

W tensorflow/core/framework/op_def_util.cc:332] Op BatchNormWithGlobalNormalization is deprecated. It will cease to work in GraphDef version 9. Use tf.nn.batch_normalization().
I tensorflow/examples/label_image/main.cc:205] daisy (0): 0.928314
I tensorflow/examples/label_image/main.cc:205] dandelion (2): 0.027702
I tensorflow/examples/label_image/main.cc:205] roses (1): 0.009
I tensorflow/examples/label_image/main.cc:205] sunflowers (3): 0.011
I tensorflow/examples/label_image/main.cc:205] tulips (4): 0.023984
...
```

Indicating that the system places the probability of the flower to be a 'daisy' at 92.83% -- a success!
