

## Supervised learning

In Supervised Machine Learning, the program is "trained" on a set of training examples, adapting correct responses for the dataset given. It can then classify or detect patterns in new, unlabeled items.

For example, let's say we wanted to augment a car with the ability to warn when there's a red light in front of it. We would equip the car with a camera that could take several photos per second of what's in front of it and pass them to an analyzer that would determine whether the image includes or not a red traffic light. To teach the system we would collect a large dataset of images including intersections with and without lights, at different times of day and different configurations. In our example, the system receives an image as input and outputs a value (frequently called _score_) for the image.

To train the system, we need to come up with an _objective function_ that can give us a measure of "correctness", or, if you will, "by how much the system missed". What we want is to guide the machine to give us the highest score for the correct values, consistently. For every item processed the objective function tells the system the measured error (distance) relative to the desired score. In response, the system performs modifications to minimize the error.

Let's look at a simpler example for a moment to see what the objective function can be. If we wanted a simple system to learn how to multiply by two, the input is any positive integer between 0 and roughly 4 billion, represented with 32 bits, and we would want the output to be another integer in bit form that is double the original value (we will ignore the problem of overflows for the purpose of this example).  

The number 8 would be represented as `00000000000000000000000000001000`. The "machine" can read a value and then operate on it by either discarding it or writing it back on any position.  Since we know exactly what the correct answer is in each case, and we're dealing with integers, the objective function is simple: for every X value of input and Z as the machine's output, we could define the error as simply F = abs(X/2 - Z). Whether the 'error' is high or low is irrelevant to us, so we use the abs() function to obtain the absolute value. If F = 0 then the result is correct.

Over time, with this kind of training and the capabilities we've given it, this very simple machine would "learn" that if you simply "push" every bit one position to the left, and add a zero at the end, you have multiplied the number by two (this binary operation is called "shift", and frequently used for its efficiency when dealing with binary).

In a deep learning system we could have millions of these components, and
millions of labeled examples with which to train and compare using the objective function. To adjust its internal values, the system computes what's called a _gradient vector_ that indicates the error amount for each of the elements, and can therefore be used in the opposite direction to reduce the error, or "distance" to the correct result. This is one of the many parameters that can be modified to change the efficiency of the system.
