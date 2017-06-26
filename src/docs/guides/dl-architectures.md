# Neural Network Architectures

The fundamental data structure of a neural network is loosely inspired by brains. Each of your brain cells (neurons) is connected to many other neurons by synapses. As you experience and interact with the world, your brain creates new connections, strengthens some connections, and weakens others. A neural network's data structure has many similarities: its "neurons" are nodes in a network connected to other nodes. Connections between nodes have a strength. [Neurons activate](https://en.wikipedia.org/wiki/Action_potential) (that is, generate an electrical signal) based on inputs they receive from other neurons.

But don't get too carried away with the biological metaphor, or you will anger both neurobiologists and computer scientists who will both tell you that neurons in your brain behave very differently from the artificial neural networks in systems such as TensorFlow.
> If you want to see some of this heat, read the [IEEE interview with UC Berkeley professor Michael Jordan from October 2014](http://spectrum.ieee.org/robotics/artificial-intelligence/machinelearning-maestro-michael-jordan-on-the-delusions-of-big-data-and-other-huge-engineering-efforts).

Having said that, let's walk through some of the common neural network architectures that you'll come across. "Architecture" is a fancy way of describing the rules that govern how nodes connect to each other and what shapes they can form. The [Wikipedia article on the types of artificial neural networks](https://en.wikipedia.org/wiki/Types_of_artificial_neural_networks) is a good reference for further exploration.

## Feedforward Neural Networks (FFNs)

Feedforward networks were the first type of artificial neural network devised. In this network the information moves in only one direction: forward. Input nodes receive data and pass it along, as seen in Figure 1.

![Simple Feedforward Network](/images/fig-1-ff-nn.png)

From the input nodes data flows through the hidden nodes (if any) and to the output nodes, without cycles or loops, and may be modified along the way by each node. They are called feedforward because processing moves forward from left to right. As [Michael Nielsen points out](http://neuralnetworksanddeeplearning.com/chap1.html), "hidden nodes" aren't some mysterious philosophical or mathematical construct: they are simply nodes in the middle of the network that are neither an input or an output.

When feedforward networks have multiple layers, they are called multilayer networks.

Create your own feedforward neural networks with the [browser-based TensorFlow playground](http://playground.tensorflow.org/). We did a brief demo in [our AI primer](http://a16z.com/2016/06/10/ai-deep-learning-machines/) (begining at about 27:17), but get in there and click around on your own. The things that you can change (depth of the network, the activation function, the learning rate, etc.) are called *hyperparameters*. So by clicking around in the playground, you are "modifying the hyperparameters of a feedforward multilayer neural network". Isn't that something?

## Convolutional (Neural) Networks (CNNs or ConvNets)

[Convolutional neural networks](http://cs231n.github.io/convolutional-networks/) are a specific type of multilayer feedforward network typically used in image recognition and (more recently) some natural language processing tasks. Introduced by [Yann LeCun, Yoshua Bengio, Leon Bottou, and Patrick Haffner in 1998](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf), they were originally to recognize handwritten postal codes and check amounts. They are faster to train than traditional feedforward networks because they make simplifying assumptions about how nodes connect to each other and how many nodes you need in the network, drastically reducing how much math you have to do to train the model.
Here's a visual from Andrej Karparthy's Stanford class to get us going. Don't worry about understanding the details just yet.
![Convolutional neural network](/images/cnn.png)

### Biologically inspired?
Some researchers point out that the design of these networks are [inspired by biology](https://www.quora.com/How-are-human-visual-perception-and-deep-learning-related) and in particular by the visual cortex. [Hubel and Wiesel discovered in the 1960s](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1359523/pdf/jphysiol01247-0121.pdf) that cats have cells which responded specifically to certain regions of the input coming in from the retina, and further that cats had both so-called [simple cells](https://en.wikipedia.org/wiki/Simple_cell) which responded to lines and edges as well as so-called [complex cells] that responded to those same inputs, even if they were rotated or in a slightly different place (that is, "spatially invariant"). They hypothesized that cells were organized into a hierarchy exactly like the neural networks we've been discussing: simple cells would feed their output to complex cells in exactly the same fashion as nodes "to the left" feed their inputs to nodes further "to the right" in a multilayer network.

Yann LeCun himself has distanced himself from the biological inspiration, saying in [a Facebook post responding](https://www.facebook.com/yann.lecun/posts/10152348155137143) to the [Michael Jordan interview mentioned above](http://spectrum.ieee.org/robotics/artificial-intelligence/machinelearning-maestro-michael-jordan-on-the-delusions-of-big-data-and-other-huge-engineering-efforts) that:
> The neural inspiration in models like convolutional nets is very tenuous. That's why I call them "convolutional nets" not "convolutional neural nets", and why we call the nodes "units" and not "neurons".

### Well known implementations of ConvNets
Specific implementations that you might read about include **LeNet**, **AlexNet**, **ZFNet**, **GoogLeNet**, **VGGNet**, and **ResNet**. Some are named after people and companies, others by some property of the network. Most of these have the won gold in the Olympics of this space, namely the [ImageNet ILSVRC](http://www.image-net.org/challenges/LSVRC/).

These networks are very cool, and here are a set of resources for learning more about them, sorted by complexity (easiest first):
* Read a [good beginner's guide written by a UCLA computer science undergrad named Adit Deshpande](https://adeshpande3.github.io/adeshpande3.github.io/A-Beginner%27s-Guide-To-Understanding-Convolutional-Neural-Networks/)
* Sample some of the answers to the Quora questions: ["What is a convolutional neural network"?](https://www.quora.com/What-is-a-convolutional-neural-network), ["What is an intuitive explanation of convolutional neural networks?"](https://www.quora.com/What-is-an-intuitive-explanation-of-Convolutional-Neural-Networks)
* Read Andrej Karpathy's [class notes from Stanford CS class CS231n: Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/convolutional-networks/). Make sure to scroll down to see the cool animation that shows you what a convolution is.
* Play with [Andrej Karpathy's ConvNetJS demo](http://cs.stanford.edu/people/karpathy/convnetjs/demo/mnist.html) which trains a Convolutional Neural Network on the MNIST digits dataset (consisting of handwritten numerical digits) in the comfort of your own browser. Javascript FTW!
* This [2013 paper by Matthew Zeiler and Rob Fergus](https://arxiv.org/abs/1311.2901) provides some visual examples that help you understand the intuition behind the architecture.


### Recurrent Neural Networks (RNNs), including Long Short-Term Memories (LSTM)
The third and last type of neural network we'll discuss is the recurrent neural network, partly because they are widely used and partly because we suspect your eyes are glazing over.

> There are many other types of neural networks. If you are interested in learning more, we suggest a visit to the Asimov's Institute [Neural Network Zoo](http://www.asimovinstitute.org/neural-network-zoo/)

Remember how in a feedforward network, computation only goes forward, or if you're looking at a diagram, "from left to right"? Also we didn't say it, but feedforward (and convolutional networks) take fixed sized inputs and outputs. Once you decide how many elements in the input and output vectors, that's it. You train the model and hope you get good results.

RNNs relax both those constraints.

First, RNNs support bi-directional data flow, propagating data from later processing stages back to earlier stages as well as linearly from input to output. This diagram from [Christopher Olah's excellent overview article](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) shows the shape of an RNN:
![Unrolled recurrent neural network](/images/RNN-unrolled.png)

This architecture enables the RNN to "remember" things, which makes them great for processing time-series data (like events in an event log) or natural language processing tasks (like understanding the roles each word plays in a sentence, in which remembering what word came before can help you figure the role of the current word).

Secondly, RNNs can process arbitrarily-sized inputs and outputs by processing vectors in a sequence, one at a time. Where feedforward and CNNs only work on fixed sized inputs and outputs, RNNs can process vectors one after another thereby work on any shape of input and output. Andrej Kaparthy comes to the rescue with a diagram that shows this from his excellent blog post titled [*The Unreasonable Effectiveness of Recurrent Neural Networks:*](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
![Arbitrary input and output sizes in RNNs](/images/sequences.png)

Read Andrej's whole blog post, which is a great explanation of the structure of RNNs. In it, he describes how to build a Paul Graham essay generator by training the system with the full 1M characters of his essays (alas, a very small corpus by AI standards) and building an RNN. You can tune one of the hyperparameters of the RNN to generate the sentence that Paul Graham is most likely to write, and that is an infinite loop of:

> "is that they were all the same thing that was a startup is that they were all the same thing that was a startup is that they were all the same thing that was a startup is that they were all the same"

Who said neural nets weren't fun?

Together, these two enhancements over feedforward networks have made RNNs incredibly powerful tools for solving many different types of AI problems including speech recognition, language modeling, machine translation, image captioning, recommendation systems, predicting the next word in a sentence for text generation systems, and others.

A specific type of RNN that you'll see discussed is called the Long Short-Term Memory (LSTM). Bizarre, no? Is the memory short or the long? Anyway, this type of RNN was introduced by [Hochreiter and Schmidhuber in 1997](https://www.researchgate.net/publication/13853244_Long_Short-term_Memory) and does an even better job of remembering something from "further back in time" compared to vanilla RNNs. 

To learn more:
* [Edwin Chen's blog post](http://blog.echen.me/2017/05/30/exploring-lstms/) complete with cartoons of Snorlax and references to jelly donuts does an excellent job of explaining the basic concepts and comparing RNNs with LSTMs. 
* Read [Christopher Olah's blog post](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) if you want to understand how LSTMs do their remembering and forgetting. It's a beautiful piece of explanatory writing and illustration. 
* Rohan Kapur's [Medium post is also great](https://ayearofai.com/rohan-lenny-3-recurrent-neural-networks-10300100899b).


# How do these architectures relate to the other Deep Learning frameworks I've heard of?
One last topic before we wrap up here is: how do these neural network architectures relate to the libraries or frameworks such as TensorFlow and Caffe I've heard of?

The quick answer is that you can implement most *neural net architectures* in each of the popular *neural network libraries*. Want to implement a feedforward or RNN in TensorFlow? You can [do that](https://www.tensorflow.org/tutorials/recurrent). How about a LSTM in Caffe? [Yup](https://github.com/junhyukoh/caffe-lstm). Feedforward network in MXNet? There's an [API call for that](http://mxnet.io/api/python/model.html#model-api-reference).

And if you can't implement a specific model in one of the popular libraries, you can always write your own so your software can eat the world.

Here are [15 machine learning libraries](http://www.kdnuggets.com/2016/04/top-15-frameworks-machine-learning-experts.html) to get you started. The indefatigable Andrej Kaparthy posted a "Google Trends"-esque type analysis showing what's hot if you peek inside [28,303 machine learning research papers over the last 5 years](https://medium.com/@karpathy/a-peek-at-trends-in-machine-learning-ab8a1085a106).

# Key Takeaways
Ok, that's enough on neural network architectures. What have we learned?
* There are many different types of neural networks, each useful for solving specific AI problems.
* The field is evolving quickly; Ian Goodfellow [invented GANs in 2014](https://arxiv.org/abs/1406.2661).
* You got here because you looked for but couldn't find a higher-level API that does what your software needs, so you needed to train your own model.
* Reminder: neural networks aren't the only machine learning algorithms. You might solve your problem with a clean data set and a simpler machine learning algorithm like a good ol' linear regression.
