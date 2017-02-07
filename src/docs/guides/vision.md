# Vision

There are AI areas focused on different senses, but _vision_ is fundamental along with natural language. Vision attempts to identify and extract symbols from raw visual data and then use those symbols to make decisions, take actions or produce information. These symbols have many forms: they can be labels from a set used for training, captions, text extracted from the image via OCR, colors, and so on. Not all images are created alike: In general, systems that are good at processing attributes for still images are not necessarily as good for processing video, and viceversa.

Sub-domains of computer vision include scene reconstruction, motion/event detection, tracking, object recognition, and image restoration among many others.

## What Can They Do?

Current Computer Vision APIs provide significant, impressive functionality with very little complexity.  We can compare raw output for the same image and different APIs with the following page:

* [Image Multi-Feature Analysis](/test/image/image-analysis)

<iframe style="width: 100%; min-height: 400px" src="/test/image/image-analysis"></iframe>

There’s plenty of information to be obtained: from tags, captions, labels, text (via OCR), detection of adult or inappropriate content, etc. Some systems will return specific coordinates in the image that allow separation of elements, either automatically or with a person’s help.

![An Image With Text Areas Automatically Highlighted](/images/image-highlights.png “An Image With Text Areas Automatically Highlighted”)

As in other API types, there is significant variability between different services in terms of features, capabilities, and so on. When moving between one service and another there aren’t any shortcuts and each API call and response will need to be verified again.

## How Do They Perform?

Running enough tests gives us an idea of how these APIs perform:

* **Image labeling, captioning, and tagging works very well for general categories, but precision drops quickly** the more specific they try to be. This is to be expected given the type of generic training given to the model, but it is still important to note.
* **Error rates are low, but high enough that you have to prepare for them carefully**. An API with a 2% error rate will fail outright for 2 out of every 100 images. For the 2 people that see the results of an incorrect analysis, the result can be jarring.
* **Image rotation, complexity and quality matter.** The same image rotated different ways can have significantly different recognition results. When the image is complex and has multiple features precision also degrades.

The good news is that all of these things can be addressed by how the system is used, rather than requiring a different technology. Here are some tips:

* Give information on what the system is seeing quickly but use smoothing (e.g. with moving averages) to prevent unexpected jumps between categories
* Don’t put the error on the person, but on the system.
* Allow quick and easy modifications for parameters that matter, in particular rotation and zoom. In the latter case, focusing on less cluttered sections of an image will frequently resolve recognition ambiguities quickly.
