# Deep Learning Architectures

The fundamental data structure of a neural network is inspired by neurons in the brain. Each of your neurons is connected to many other neurons by synapses. As you experience and interact with the world, your brain creates new connections, strengthens some connections, and weakens others. A neural network's data structure has many similarities: its "neurons" are nodes in a network connected to other nodes. Connections between nodes have a strength.   

But don't get too carried away with the biological metaphor, or you will anger both neurobiologists and computer scientists who will both tell you that neurons in your brain behave very differently from the neural networks in systems such as TensorFlow. If you want to see some of this heat, read the [IEEE interview with UC Berkeley professor Michael Jordan from October 2014](http://spectrum.ieee.org/robotics/artificial-intelligence/machinelearning-maestro-michael-jordan-on-the-delusions-of-big-data-and-other-huge-engineering-efforts).

Having said that, let's walk through some of the common neural network architectures that you'll come across. "Architecture" is a fancy way of describing the rules that govern how nodes connect to each other and what shapes they can form. The [Wikipedia article on the types of artificial neural networks](https://en.wikipedia.org/wiki/Types_of_artificial_neural_networks) is a good reference for further exploration.

## Feedforward Neural Networks (FFNs)

Feedforward networks were the first type of artificial neural network devised. In this network the information moves in only one direction: forward. Input nodes receive data and pass it along, as seen in Figure 1.

![Fig. 1. Simple Feedforward Network](/images/fig-1-ff-nn.png)

From the input nodes data flows through the hidden nodes (if any) and to the output nodes, without cycles or loops, and may be modified along the way by each node. They are called feedforward because processing moves forward from left to right. As [Michael Nielsen points out](http://neuralnetworksanddeeplearning.com/chap1.html), "hidden nodes" aren't some mysterious philosophical or mathematical construct: they are simply nodes in the middle of the network that are neither an input or an output.

When feedforward networks have multiple layers, they are called multilayer networks.

## Convolutional (Neural) Networks (CNNs or ConvNets)

[Convolutional neural networks](http://cs231n.github.io/convolutional-networks/) are a specific type of multilayer feedforward network typically used in image recognition and (more recently) some natural language processing tasks. Introduced by [Yann LeCun, Yoshua Bengio, Leon Bottou, and Patrick Haffner in 1998](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf), they were originally to recognize handwritten postal codes and check amounts. They are faster to train than traditional feedforward networks because they make simplifying assumptions about how nodes connect to each other and how many nodes you need in the network, drastically reducing how much math you have to do to train the model.

### Biologically inspired?
Some researchers point out that the design of these networks are [inspired by biology](https://www.quora.com/How-are-human-visual-perception-and-deep-learning-related) and in particular by the visual cortex. [Hubel and Wiesel discovered in the 1960s](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1359523/pdf/jphysiol01247-0121.pdf) that cats have cells which responded specifically to certain regions of the input coming in from the retina, and further that cats had both so-called [simple cells](https://en.wikipedia.org/wiki/Simple_cell) which responded to lines and edges as well as so-called [complex cells] that responded to those same inputs, even if they were rotated or in a slightly different place (that is, "spatially invariant"). They hypothesized that cells were organized into a hierarchy exactly like the neural networks we've been discussing: simple cells would feed their output to complex cells in exactly the same fashion as nodes "to the left" feed their inputs to nodes further "to the right" in a multilayer network.  

Yann LeCun himself has distanced himself from the biological inspiration, saying in [a Facebook post responding](https://www.facebook.com/yann.lecun/posts/10152348155137143) to the [Michael Jordan interview mentioned above](http://spectrum.ieee.org/robotics/artificial-intelligence/machinelearning-maestro-michael-jordan-on-the-delusions-of-big-data-and-other-huge-engineering-efforts) that:
> The neural inspiration in models like convolutional nets is very tenuous. That's why I call them "convolutional nets" not "convolutional neural nets", and why we call the nodes "units" and not "neurons".

### Well known implementations of ConvNets
Specific implementations that you might read about include **LeNet**, **AlexNet**, **ZFNet**, **GoogLeNet**, **VGGNet**, and **ResNet**. Some are named about people and companies, others by some property of the network. Most of these have the won gold in the Olympics of this space, namely the [ImageNet ILSVRC](http://www.image-net.org/challenges/LSVRC/).

These networks are very cool, and here are a set of resources for learning more about them, sorted by complexity (easiest first):
* Read a [good beginner's guide written by a UCLA computer science undergrad named Adit Deshpande](https://adeshpande3.github.io/adeshpande3.github.io/A-Beginner%27s-Guide-To-Understanding-Convolutional-Neural-Networks/)
* Sample some of the answers to the Quora questions:
  * ["What is a convolutional neural network"?](https://www.quora.com/What-is-a-convolutional-neural-network)
  * ["What is an intuitive explanation of convolutional neural networks?"](https://www.quora.com/What-is-an-intuitive-explanation-of-Convolutional-Neural-Networks)
* Read Andrej Karpathy's [class notes from Stanford CS class CS231n: Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/convolutional-networks/). Make sure to scroll down to see the cool animation that shows you what a convolution is.
* Play with [Andrej Karpathy's ConvNetJS demo](http://cs.stanford.edu/people/karpathy/convnetjs/demo/mnist.html) which trains a Convolutional Neural Network on the MNIST digits dataset (consisting of handwritten numerical digits) in the comfort of your own browser. Javascript FTW!
* This [2013 paper by Matthew Zeiler and Rob Fergus](https://arxiv.org/abs/1311.2901) provides some visual examples that help you understand the intuition behind the architecture.


### Recurrent Neural Networks (RNNs)

RNNs support bi-directional data flow, propagating data from later processing stages back to earlier stages and well as linearly from input to output. The recurrent use of the layers enable processing of arbitrary data lengths, but they also tend to require greater scale and larger data sets.
