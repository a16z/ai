# Ways In Which Machines Learn

There are four major ways to train deep learning networks: _supervised_, _unsupervised_, _semi-supervised_, and _reinforcement learning_. We'll explain the intuitions behind each of the these methods. Along the way, we'll share terms you'll read in the literature (in parantheses) and point to more resources for the mathematically inclined. By the way, these categories span both traditional machine learning algorithms and the newer, fancier deep learning algorithms.

## Supervised Learning
**Supervised Learning** trains networks using examples where we already know the correct answer (ground truth). Say we're trying to train a network to recognize pictures that have your parents in them. First, grab all your photos. Ready? Let's go:
1. Go through your photos (data set) and identify all the pictures that have your parents in them (labeling the data set with ground truth).
2. Take the whole stack of photos and split them into two piles. We'll use the first pile to train the network (training data). We'll use the second pile of photos (validation data) to see how accurate the model is at picking out photos with our parents. 
3. Feed the photos to your model. Mathematically, our goal is for the deep network to find a function whose input is a photo and whose output is a 0 (your parents are not in this photo) or 1 (yup, that's your folks). 
* This is called a categorization task. 
* Supervised learning can also be used to output a set of values, rather than just a 0 or 1. 
* For example, we might train a network to output the probability that someone will repay a credit card loan, in which case the output is anywhere between 0 and 100. These tasks are called regressions. 
4. For each photo, the model makes a prediction by following rules (activation function) to decide whether to light up a particular node in the work. The model works from left to right one layer a time (let's ignore more complicated networks for the moment). After the network calculates this for every node in the network, we'll get to the rightmost node (output node) which lights up (or not). 
5. Since we already know which pictures have your parents in them, we can tell the model whether its prediction is right or wrong. The model uses this feedback (cost function, also called an objective function, a utility function or a fitness function) to re-adjust the weights and biases between the nodes in the network (backpropogation). There are a variety of mathematical techniques to use this knowledge of whether the model was right or wrong back into the model, but a very common method is gradient descent. [Algobeans](https://algobeans.com/2016/11/03/artificial-neural-networks-intro2/) has a good layman's explanation of how this works. Michael Nielsen [adds the math](http://neuralnetworksanddeeplearning.com/chap2.html) which involves calculus and linear algebra (and a friendly demon!).   
6. Once we've fed all the photos from our first stack, we're ready to test the model. Grab the second stack and use them to see how accurately the trained model can pick up photos of your parents. You can repeat by tweaking various things about your model (hyperparamters), such as how many nodes there are, how many layers there are, which mathematical function to use to decide whether a node lights up, how aggressively to train the weights during the backpropogation phase, and so on. This [Quora answer](https://www.quora.com/What-are-hyperparameters-in-machine-learning) has a good explanation of the knobs you can turn. 
7. Finally, once you've gotten an accurate model, you deploy that model into your application. Your application can call a function such as ParentsInPicture(), and the model will make its prediction (make an inference).

It can be hard (read: expensive) to get the data, so you need to make sure the value of the prediction a trained model will make justifies the cost of getting the labeled data and training the model in the first place. For example, getting labeled X-rays of people who might have cancer is expensive, but the value of an accurate model that generates few false positives and few false negatives is obviously very high.

## Unsupervised Learning

**Unsupervised Learning** is for situations where you have a data set but no labels. Unsupervised learning takes the input set and tries to find patterns in the data, for instance by organizning them into groups (clustering) or finding outliers (anomaly detection). For example:
* Imagine you are a T-shirt manufacturer, and you have a bunch of people's body measurements. You'd like a clustering algorithm that groups those measurements into a set of clusters so you can decide how big to make your XS, S, M, L, and XL shirts. 
* You are the CTO of a security startup and you want to find anomolies in the history of network connections between computers: network traffic that looks unusual might help you find an employee downloading all their CRM history because they'are about to quit or someone transferring an abnormally large amount of money to a new bank account. If you're interested in this sort of thing, you'll like this [survey of unsupervised anomaly detection algorithms](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0152173).
* You are on the Google Brain team, and you wonder what's in YouTube videos. This is the very real story of the seminal  
"YouTube cat finder" that [kindled the general public's enthusiasm for AI](https://www.wired.com/2012/06/google-x-neural-network/). In [this paper](https://arxiv.org/abs/1112.6209), the Google Brain team in conjunction with Stanford researchers Quoc Le and Andrew Ng describe an algorithm that groups YouTube videos into a bunch of categories, including one that contained cats. They didn't set out to cats, but the algorithm automatically grouped videos containing cats (and thousands of other objects from the 22,000 object categories defined in ImageNet) in them with no labels.

To learn more about unsupervised learning, try [this Udacity class](https://www.udacity.com/course/machine-learning-unsupervised-learning--ud741). 

One of the [most promising recent developments in unsupervised learning](https://www.quora.com/What-are-some-recent-and-potentially-upcoming-breakthroughs-in-deep-learning) is an idea from Ian Goodfellow (who was working in Yoshua Bengio's lab at the time) called "generative advesarial networks" in which we pit two neural networks against each other: one network, called the generator is responsible for generating data designed to try and trick the other network, called the discriminator. This approach is achieving some amazing results, such as AI which can generate photo-realistic pictures from [text strings](https://arxiv.org/abs/1612.03242) or [hand-drawn sketches](https://arxiv.org/pdf/1611.07004v1.pdf).


## Semi-supervised Learning
**Semi-supervised learning** combines a lot of unlabeled data with a small amount of labeled data during the training phase.  The trained models that result from this training set are highly accurate and less expensive to train compared to using all labeled data. Our friend Delip Rao at the AI consulting company [Joostware](http://joostware.com/), for example, built a solution using semi-supervised learning using just 30 labels per class which got the same accuracy as a model trained using supervised learning which required ~1360 labels per class. This enabled their client to scale their prediction capabilities from 20 categories to 110 categories very quickly.

## Reinforcement Learning
**Reinforcement learning** depends on interaction between the system and an environment, and while there are similar elements at play the goals are related to an accumulation of action and environmental responses that are useful for planning or control problems. Watch this technique in action with a reinforcement learning system that [learned to play Super Mario Brothers like a boss](https://www.youtube.com/watch?v=L4KBBAwF_bE). 




## Supervised learning

In Supervised Machine Learning, the program is “trained” on a set of training examples, adapting correct responses for the dataset given. It can then classify or detect patterns in new, unlabeled items.

For example, let's say we wanted to augment a car with the ability to warn when there's a red light in front of it. We would equip the car with a camera that could take several photos per second of what's in front of it and pass them to an analyzer that would determine whether the image includes or not a red traffic light. To teach the system we would collect a large dataset of images including intersections with and without lights, at different times of day and different configurations. In our example, let's say the system receives an image as input and outputs a value (frequently called "score") for the image.

To train the system, we need to come up with an _objective function_ that can give us a measure of "correctness", or, if you will, "by how much the system missed". What we want is to guide the machine to give us the highest score for the correct values, consistently. For every item processed the objective function tells the system the measured error (distance) relative to the desired score. In response, the system performs modifications to minimize the error.

Let's look at a simpler example for a moment to see what the objective function can be. If we wanted a simple system to learn how to multiply by two, the input is any positive integer between 0 and roughly 4 billion, represented with 32 bits, and we would want the output to be another integer in bit form that is double the original value (we will ignore the problem of overflows for the purpose of this example).  

The number 8 would be represented as `00000000000000000000000000001000`. The "machine" can read a value and then operate on it by either discarding it or writing it back on any position.  Since we know exactly what the correct answer is in each case, and we're dealing with integers, the objective function is simple: for every X value of input and Z as the machine's output, we could define the error as simply F = abs(X/2 - Z). Whether the 'error' is high or low is irrelevant to us, so we use the abs() function to obtain the absolute value. If F = 0 then the result is correct.

Over time, with this kind of training and the capabilities we've given it, this very simple machine would "learn" that if you simply "push" every bit one position to the left, and add a zero at the end, you have multiplied the number by two (this binary operation is called "shift", and frequently used for its efficiency when dealing with binary).

In a deep learning system we could have millions of these components, and
millions of labeled examples with which to train and compare using the objective function. To adjust its internal values, the system computes what's called a _gradient vector_ that indicates the error amount for each of the elements, and can therefore be used in the opposite direction to reduce the error, or "distance" to the correct result. This is one of the many parameters that can be modified to change the efficiency of the system.



## Unsupervised Learning

"Supervised learning", then, is a mechanism in which the data samples are explicitly _labeled_ and therefore those in which the system will be told whether a mistake was made or not (and of what degree).

For unsupervised algorithm the examples aren't labeled, but patterns can still be detected. In this case, such as the famous [Google experiment with YouTube videos](https://googleblog.blogspot.com/2012/06/using-large-scale-brain-simulations-for.html) [paper](/reference-material/le2013building.pdf) in which the system learned to reliably separate cats from other things, or _cluster images of cats together_. It didn't "know" what a cat was at all, but it could reliably identify something that _we_ (humans) call a "cat" in videos. This is an important distinction. The ability to see a pattern has nothing to do with the ability to understand what the pattern means, or what it is, or isn't.

The Google team also combined labeled with unlabeled datasets. The system might flag a data item as needing a label (for example, it might have high confidence that there's something labeled 'cat' in the picture but needs confirmation of something else that it identified as a separate entity but doesn't have a label for, e.g. a dog). Other approaches involve, for example, multiple systems that use labeled data to classify unlabeled data and then have a back and forth comparing results and arriving at conclusions based on their shared results.
