# Ways In Which Machines Learn

There are four major learning paradigms: _supervised_, _unsupervised_, _semi-supervised_, and _reinforcement learning_.

**Supervised Learning** depends on a set of pre-existing data that is "labeled" in that we already know what the output of the network is expected to be for each pattern it is given. The process of learning can then use an objective function to quantify the mismatch between the expected and the observed results, and the network's weights can be adjusted accordingly. It can be hard (read: expensive) to get the data, so you need to make sure the value of the prediction a trained model will make justifies the cost of getting the labeled data and training the model in the first place. For example, getting labeled X-rays of people who might have cancer is expensive, but the value of an accurate model that generates few false positives and few false negatives is obviously very high.

**Unsupervised Learning** uses datasets that aren't labeled to identify clusters of data based on a cost function to be minimized. The function does not necessarily lead to a straight classification problem, but perhaps to a filtering or mapping of data. The famous ["Google cat paper"](https://googleblog.blogspot.com/2012/06/using-large-scale-brain-simulations-for.html) which found cats and other things by watching lots and lots of YouTube videos is a great example of unsupervised learning. They didn't set out to cats, but the algorithm grouped video frames that had cats (and thousands of other objects from the 22,000 object categories defined in ImageNet) in them. 

**Semi-supervised learning** combines lots of unlabeled data with really small amounts of labeled data to learn a highly performant model. Our friend Delip Rao at the AI consulting company [Joostware](http://joostware.com/), for example, built a solution using semi-supervised learning using just 30 labels per class which got the same accuracy as a model trained using supervised learning which required ~1360 labels per class. This enabled their client to scale from 20 categories to 110 categories very quickly.

**Reinforcement Learning** depends on interaction between the system and an environment, and while there are similar elements at play the goals are related to an accumulation of action and environmental responses that are useful for planning or control problems. Watch this technique in action with a reinforcement learning system that [learned to play Super Mario Brothers like a boss](https://www.youtube.com/watch?v=L4KBBAwF_bE). 




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
