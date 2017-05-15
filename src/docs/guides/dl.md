# Training Your Own Models

If you've played with the examples from the previous sections on NLP and vision recognition, you've seen the power of APIs. Send in a picture, get a list of objects in that picture; send in a sentence, and get the emotional tilt of that sentence, or get the sentence back in another language. Magic.

Just as with other areas of software development, sometimes the API you need doesn't exist and you'll have to write your own code. A common starting point for AI programming is to select a machine learning algorithm, train it with data (see [this Medium post for a set of strategies for getting data](https://medium.com/@muellerfreitag/10-data-acquisition-strategies-for-startups-47166580ee48), and then expose that trained model via APIs to the rest of your code can call.

There are a [large](http://machinelearningmastery.com/a-tour-of-machine-learning-algorithms/) [set](http://www.kdnuggets.com/2016/08/10-algorithms-machine-learning-engineers.html)of [machine learning algorithms](https://en.wikipedia.org/wiki/Machine_learning) with fun names such as decision trees, random forest, support vector machines, logistic regression, and so on. Each algorithm is best suited for a specific situation depending on how much data you have, how many "features" or dimensions of data you can feed the algorithms, how sparse or dense the data set is, and so on. Sometimes it's hard to figure out which algorithm to use, and you will have to try a few different algorithms (and combinations of algorithms) to see how they do.

Here are a few good starting points to picking the right ML algorithm to solve your specific problem:
* [How to choose machine learning algorithms for Microsoft Azure machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-algorithm-choice)
* [Stack Overflow answer to "When to choose which machine learning classifer?"](http://stackoverflow.com/questions/2595176/when-to-choose-which-machine-learning-classifier)
* Scikit-learn documentation: [Choosing the right estimator](http://scikit-learn.org/stable/tutorial/machine_learning_map/)

Deep learning is a class of machine learning that has gotten a lot of well-deserved attention in recent years because it's working to solve a wide variety of AI problems in vision, natural language processing, and many others. Also, in contrast with many of the other machine learning algorithms where data scientists or software engineers have to figure out which features will lead to good predictions, deep learning approaches figure out the features themselves.

For example, let's say you were using linear regressions to try to predict the price of a home like Trulia does. With most machine learning approaches, you'd have to figure out "features" (think of them as factors that will drive price like how big the house is, when the house was built, the price of nearby houses, the number of bedrooms and bathrooms, and so forth). With deep learning, you don't pick the features. The algorithms essentially find the features for you in the data.

For both these reasons (namely, (1) it's working and (2) it figures out features on its own), we'll spend the rest of the time in this playbook digging into deep learning. But before we continue, this tweet is spot on:
![True tweet about machine learning](/images/regression.png)

We'd encourage you to try potentially simpler, admittedly less glamorous algorithms before deep learning. Sometimes a linear regression is all you need.

## Deep Learning
Having said that, deep learning algorithms are incredibly powerful and getting amazing results across many different domains. Professor Christopher Manning, a longtime veteran of NLP research at Stanford, says in his [introductory lecture for "CS Natural Language Processing with Deep Learning"](https://www.youtube.com/watch?v=OQQ-W_63UgQ&list=PL3FW7Lu3i5Jsnh1rnUwq_TcylNr7EkRe6) that "in the length of my lifetime, I'd actually say it's unprecedented [for] a field to progress so quickly".

Deep learning data structures and algorithms were originally inspired by the way neurons in the brain work, but most researchers today will tell you that brains and neural networks used in software like TensorFlow are very different. But if you are interested in the history of how we got here, check out these excellent resources which we've ordered by depth, from most concise to most comprehensive, for your reading pleasure.
* Andrew L. Beam, [Deep Learning 101](http://beamandrew.github.io/deeplearning/2017/02/23/deep_learning_101_part1.html)
* Andrey Kruenkov, [A "Brief" of Neural Nets and Deep Learning](http://www.andreykurenkov.com/writing/a-brief-history-of-neural-nets-and-deep-learning/)
* Haohan Wang and Bhiksha Raj, [On the Origin of Deep Learning](https://arxiv.org/pdf/1702.07800.pdf) provide a good historical overview, explaining concepts including the math
* Jurgen Schmidhuber, [Deep Learning in Neural Networks: An Overview](https://arxiv.org/pdf/1404.7828.pdf) provides the most comprehensive and technically dense overview

## Why "Deep"?
By the way, why do we call it "deep learning"? It's called deep learning because the underlying algorithms work on data structure that looks like a graph of connected nodes, and the nodes are organized into layers. Data goes into the left-most nodes, and the output comes out the right hand side. Between the input and output nodes, there are many layers of other nodes; hence, the network is "deep". This [diagram from nVidia](https://devblogs.nvidia.com/parallelforall/accelerate-machine-learning-cudnn-deep-neural-network-library/) does a good job of illustrating the concept:
![Why is deep learning "deep"?](/images/nn_example-624x218.png)

To learn more:
* Watch legend Jeff Dean from the Google Brain team lecture on [Large-Scale Deep Learning for Intelligent Computer Systems](https://www.youtube.com/watch?v=4hqb3tdk01k)
* Read Michael Nielsen's excellent ebook and Website [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/index.html)

## Why Now?
You might be wondering why this revolution is happening now given that some of the original ideas date back to the 1950s. The short answer is a common one in technology: bountiful and inexpensive compute, storage, and data. Andrew Ng shares this conceptual graph illustrating how the effectiveness of deep learning improves as you feed it more data and more computing resources:
![Why is deep learning working now?](/images/andrewNg.png)

While the fundamental ideas are generally the same, the scale at which we are using them has changed, and that has brought quantitatively different (and better) results, in part because we can now test ideas we couldn't test before. Scale constraints created a barrier to evolution. As cloud computing has made large-scale experiments possible, the techniques have evolved and improved significantly.

Professor Geoff Hinton (Google and University of Toronto) discussed why previous approaches failed. The first two reasons he identifies have to do with scale ("Our labeled datasets were thousands of times too small ") and compute capabilities ("Our computers were millions of times too slow") which clearly don't speak only to the speed of processors but compute capacity in general (ie., including processor, memory, storage, networking).
