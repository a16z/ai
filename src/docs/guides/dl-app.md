
# Recipe Part 2: Adding AI to Our Moible App

If you've arrived here from Part 1 of the recipe, you have a TensorFlow model. Now let's add AI superpowers using that trained TensorFlow model to our iPhone app.

## <a name="setupiOS"></a>Setup and Test the iOS App


### 0. Open Terminal

Like in the initial TensorFlow setup, we start by [having a trusty Terminal always open](/docs/guides/dl-start#openTerminal) by our side -- please follow that link if you need a reminder of the steps. We will continue our convention of using full paths instead of bash shortcuts to keep problems to a minimum, so whenever you see `/Users/joe/` you will have to replace it with your own home path ([here's why we do this]](/docs/guides/dl-start#openTerminal)).


### Retraining the Model

Retraining the model follows the same steps [described earlier](/docs/guides/dl-start) and some additional optimizations that we can make on the dataset for running on mobile.

Below, you will find each step with a brief description of what it accomplishes. To make it easier, however, we have created a shell script that will run the entire process you can [download the script here as a zipfile](/scripts/runtraining.sh.zip) which you can then uncompress in your home directory.

At the top of the script you'll find the following line

```bash
TARGET_ROOT_FOLDER=/Users/joe
```

Change that value to the folder you have been using to store both `tf_files` and `tensorflow` directories, and then you can run the script:

```bash
$ ./runtraining.sh
```

While the script is running, you can keep reading to see what the different commands are. In case of errors, the script should direct you to the right section of [this FAQ](/docs/guides/dl-errors-faq).

If you followed the previous examples you should already have the Inception model downloaded. However, if you want to make sure you have an unmodified copy, you can download it again by running

```bash
curl -o /Users/joe/tf_files/inception.zip \
 https://storage.googleapis.com/download.tensorflow.org/models/inception5h.zip \
 && unzip /Users/joe/tf_files/inception.zip -d /Users/joe/tf_files/inception
```

Then, download the training data for the app we are going to build:

```bash
curl -o /Users/joe/tf_files/a16zset.zip \
 https://cryptic-alpha.herokuapp.com/a16zset.zip \
 && unzip /Users/joe/tf_files/a16zset.zip -d /Users/joe/tf_files/a16zset
```

In the end, you should have both the `/tf_files/inception` folder and a new folder `/tf_files/a16zset` which contains two main datasets: `business_card` and `not_business_card`.

**Note:** as mentioned previously, our dataset is based on the [Stanford Mobile Dataset](/reference-material/chandrasekhar2011stanford.pdf), built as follows:

* We selected the dataset that includes images of business cards, book covers and CD covers but did not use all 500 images for each category.
* We then expanded the sets with additional images obtained via web searches, verifying that they had been marked for reuse (according to Google Search) and added a new category for credit cards, which can be very similar to business cards.
* Finally we normalized the images to dimensions of 640x480 with medium JPEG compression. This isn't required by the process but we wanted to keep the dataset a relatively small download and have a reference image size that we could use later with the mobile app.  

This showcases the flexibility afforded by DL for real-world applications while keeping complexity of the training process to a minimum. In our app the image recognition process is intended to speed up, rather than completely replace, human interaction, so even lower-probability matches can be useful.

To retrain the model, we use the same command as before, pointing it to the new dataset:

```bash
$ bazel-bin/tensorflow/examples/image_retraining/retrain \
--bottleneck_dir=/Users/joe/tf_files/a16z_bottlenecks \
--model_dir=/Users/joe/tf_files/inception \
--output_graph=/Users/joe/tf_files/a16z_retrained_graph.pb \
--output_labels=/Users/joe/tf_files/a16z_retrained_labels.txt \
--image_dir /Users/joe/tf_files/a16zset
```

# Using the Model in the iOS App

Our iOS App uses the iOS static [TensorFlow library](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/contrib/ios_examples) along with our own Swift Code for it. 
