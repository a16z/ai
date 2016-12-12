
## Unsupervised Learning

"Supervised learning", then, is a mechanism in which the data samples are explicitly _labeled_ and therefore those in which the system will be told whether a mistake was made or not (and of what degree).

For unsupervised algorithm the examples aren't labeled, but patterns can still be detected. In this case, such as the famous [Google experiment with YouTube videos](https://googleblog.blogspot.com/2012/06/using-large-scale-brain-simulations-for.html) [paper](/reference-material/le2013building.pdf) in which the system learned to reliably separate cats from other things, or _cluster images of cats together_. It didn't "know" what a cat was at all, but it could reliably identify something that _we_ (humans) call a "cat" in videos. This is an important distinction. The ability to see a pattern has nothing to do with the ability to understand what the pattern means, or what it is, or isn't.

The Google team also combined labeled with unlabeled datasets. The system might flag a data item as needing a label (for example, it might have high confidence that there's something labeled 'cat' in the picture but needs confirmation of something else that it identified as a separate entity but doesn't have a label for, e.g. a dog). Other approaches involve, for example, multiple systems that use labeled data to classify unlabeled data and then have a back and forth comparing results and arriving at conclusions based on their shared results.

# (Some) Neural Network Terminology

There are [many types of neural network topologies and training techniques](https://en.wikipedia.org/wiki/Types_of_artificial_neural_networks) in use. Here are some of the most common terms you may encounter in current ML papers and tutorials, and their differences.  

## Feedforward Neural Networks (FFNs)

Feedforward networks were the first type of artificial neural network devised. In this network the information moves in only one direction: forward. Input nodes receive data and pass it along, as seen in Figure 1.

![Fig. 1. Simple Feedforward Network](/images/fig-1-ff-nn.png)

From the input nodes data flows through the hidden nodes (if any) and to the output nodes, without cycles or loops, and may be modified along the way by each node.

## Convolutional Neural Networks (CNNs)

Convolutional neural networks are variations of multilayer networks which are designed to use minimal amounts of preprocessing for _images_. With that constraint on the input and its corresponding properties, functions can be simpler and the network more efficient.

## Recurrent Neural Networks (RNNs)

RNNs support bi-directional data flow, propagating data from later processing stages back to earlier stages and well as linearly from input to output. The recurrent use of the layers enable processing of arbitrary data lengths, but they also tend to require greater scale and larger data sets.
