
## Unsupervised Learning

"Supervised learning", then, is a mechanism in which the data samples are explicitly _labeled_ and therefore those in which the system will be able to definitely know whether a mistake was made or not.

For unsupervised algorithm the examples aren't labeled. In this case, such as the famous [Google experiment with YouTube videos](https://googleblog.blogspot.com/2012/06/using-large-scale-brain-simulations-for.html) [paper](/reference-material/le2013building.pdf) in which the system learned to reliably separate cats from other things, or _cluster images of cats together_. It didn't "know" what a cat was at all, but it could reliably identify something that _we_ (humans) call a "cat" in videos. This is an important distinction. The ability to see a pattern has nothing to do with the ability to understand what the pattern means, or what it is, or isn't.

The Google team also combined labeled with unlabeled datasets. The system might flag a data item as needing a label (for example, it might be sure that there's something labeled 'cat' in the picture but needs confirmation of something else that it identified as a separate entity but doesn't have a label for, e.g. a dog). Other approaches involve, for example, multiple systems that use labeled data to classify unlabeled data and then have a back and forth comparing results and arriving at conclusions based on their shared results.
