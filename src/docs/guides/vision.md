# Computer Vision

There are AI areas focused on different senses, but _vision_ is fundamental along with natural language. Vision attempts to identify and extract symbols from raw visual data and then use those symbols to make decisions, take actions or produce information. These symbols have many forms: they can be labels from a set used for training, captions, text extracted from the image via OCR, colors, and so on. Not all images are created alike: In general, systems that are good at processing attributes for still images are not necessarily as good for processing video, and vice-versa.

Sub-domains of computer vision include scene reconstruction, motion/event detection, tracking, object recognition, and image restoration among many others.

## What Can They Do?

Current Computer Vision APIs provide significant, impressive functionality with very little complexity. 

There’s plenty of information to be obtained: from tags, captions, labels, text (via OCR), detection of adult or inappropriate content, etc. Some systems will return specific coordinates in the image that allow separation of elements, either automatically or with a person’s help.

![An Image With Text Areas Automatically Highlighted](/images/image-highlights.png "An Image With Text Areas Automatically Highlighted")

As in other API types, there is significant variability between different services in terms of features, capabilities, and so on. When moving between one service and another there aren’t any shortcuts and each API call and response will need to be verified again.

## How Do They Perform?

Running enough tests gives us an idea of how these APIs perform:

* **Image labeling, captioning, and tagging works very well for general categories, but precision drops quickly** the more specific they try to be. This is to be expected given the type of generic training given to the model, but it is still important to note.
* **Error rates are low, but high enough that you have to prepare for them carefully**. An API with a 2% error rate will fail outright for 2 out of every 100 images. For the 2 people that see the results of an incorrect analysis, the result can be jarring.
* **Image rotation, complexity and quality matter.** The same image rotated different ways can have significantly different recognition results. When the image is complex and has multiple features precision also degrades.

The good news is that all of these things can be addressed by how your code uses the underlying APIs. Also, the systems are improving rapidly. For example, a specific type of deep learning system called a convolutional neural network (which we'll discuss later) are enabling much higher accuracy for rotated images these days. Here are some tips to get the most out of the current generation of technology:

* Give information on what the system is seeing quickly but use smoothing (e.g. with moving averages) to prevent unexpected jumps between categories
* Don’t put the error on the person, but on the system.
* Allow quick and easy modifications for parameters that matter, in particular rotation and zoom. In the latter case, focusing on less cluttered sections of an image will frequently resolve recognition ambiguities quickly.

## A Word on Efficiency

When you are implementing a vision recongition system (or most any machine learning-based software system), you need to be aware of two costs:
* **Training costs.** Iterating on over different configuration parameters in order to increase model performance is a time-consuming and expensive process called [hyperparameter optimization](https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)#Optimization). How much will it cost you to train a model, and what kind of accuracy can you get for a given amount of training? This type of training consumes lots of CPU (and possibly [GPU](https://devblogs.nvidia.com/parallelforall/sigopt-deep-learning-hyperparameter-optimization/)), so you need to keep an eye on your [Amazon bill](https://aws.amazon.com/blogs/ai/fast-cnn-tuning-with-aws-gpu-instances-and-sigopt/). 
* **Inference costs.** Once you have a trained model, you'll use that model to "make inferences", the practioner's fancy way of saying "using a trained model to make predictions". Here, you might need to be careful with CPU/GPU usage (battery consumption) or have only a limited amount of memory. Different algorithms are hungrier for power and memory than others, as [this handy analysis](https://arxiv.org/pdf/1605.07678.pdf) by Alfredo Canziani, Eugenio Culurciello (Purdue University), and Adam Paszke (University of Warsaw) shows. This graph shows the number of operations each system (one of the colored bubbles) requires to reach a certain accuracy on a specific image recognition test in ImageNet, the definitive image-recongition test set.
![How systems compare on number of operations required for a given accuracy level](/images/efficiency.png "How systems compare on number of operations required for a given accuracy level")

Keep both of these costs in mind as you are designing your system.

