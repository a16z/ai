# Deep Learning


From [Wikipedia](https://en.wikipedia.org/wiki/Deep_learning):

> Deep learning (also known as deep structured learning, hierarchical learning or deep machine learning) is a branch of machine learning based on a set of algorithms that attempt to model high level abstractions in data by using a deep graph with multiple processing layers, composed of multiple linear and non-linear transformations

What is a Neural Net, what it does:

Learn a complicated function from data,
...or... allow you to transform inputs in one space into outputs in another space


# What's New, What Isn't

If you know a bit of the history of AI, you might wonder what's really new about all this, in essence, you could very reasonably ask: "Haven't We Tried This Before?"

The answer is: not really.

While the fundamental ideas are generally the same, the scale at which we are using them has changed, and that has brought quantitatively different (and better) results, in large part because we can now test ideas we couldn't test before. Scale constraints also created a barrier to evolution. As cloud computing has made large-scale experiments possible, the techniques have also evolved and improved significantly.

Prof Geoff Hinton (Google and University of Toronto) discussed why previous approaches failed [at this point in the talk](https://youtu.be/VhmE_UXDOGs?t=1330). The first two reasons he identifies have to do with scale ("Our labeled datasets were thousands of times too small ") and compute capabilities ("Our computers were millions of times too slow") which clearly don't speak only to the speed of processors but compute capacity in general (ie., including processor, memory, storage, networking).

The difference in scale, and specifically the number of processing layers that enabled, is where the 'deep' of 'deep learning' comes into play.

## Why "Deep"

Jeff Dean (from Google) [echoes the idea](https://youtu.be/QSaZGT4-6EY?t=315) during a talk earlier this year, "Large-Scale Deep Learning for Intelligent Computer Systems" an later [adds](https://youtu.be/QSaZGT4-6EY?t=561):

> "Deep refers to the number of layers [...]. I think of them as deep neural networks generally.""

# Machine Learning

Machine Learning can be generally defined as algorithms that are data-driven, as opposed to involving codification of behavior. For example, for a robot that had to navigate a flat grid, you could write relatively simple sets if-then-else rules to get the car from one end to the other. You would be in a sense "encoding" appropriate rules about driving, time to take, etc. With machine learning, the system would be, instead, "learning by example" -- you could simulate several paths taken and grade them according to time, fuel, etc, and the system will eventually learn and be able to predict (or, in a sense, _plan ahead_) what a reasonable route could be.

In this example, the system's learning is _supervised_, perhaps the most common form of ML, which we'll discuss next.
