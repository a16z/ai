
## Knowledge Representation

Knowledge Representation aims to codify information about the world in actionable, and to whatever degree possible, "objective," form, so that systems can reason about it. For example: "The sky is blue" is neither actionable nor objective. "The sky's color is identified by humans as blue'." is a bit better. But still leaves out a lot of ideas (what's a color, what's a human, etc.)

Knowledge representation is part of what we referred above as "Classical AI". Newell & Simon's General Problem Solver (1958) used decomposition to turn goals into subgoals and then chose strategies that could accomplish each subgoal. Systems such as these were in fact fairly limited in their domains, and they gave rise to so-called _expert systems_ of the 1970s and 1980s, which specifically tried to represent human expertise and knowledge on different fields so it could be shared and applied more easily. Expanding on this idea, systems like [Cyc](https://en.wikipedia.org/wiki/Cyc) have been in development for many years but have found limited success in creating the basis for large-scale intelligent systems of wide applicability.

Even when using knowledge-based or expert systems, some tasks require a different approach: of these, the most notable and widely applicable is _pattern recognition_.

# Pattern Recognition

<blockquote class="blockquote-reverse small">
   <p>Since the advent of electronic computers and modern servo systems, an increasing amount of attention has been focused on the feasibility of constructing a device possessing such human-like functions as perception, recognition, concept formation, and the ability to genera­lize from experience. In particular, interest has centered on the idea of a machine which would be capable of conceptualizing inputs impinging directly from the physical environment of light, sound, temperature, etc. -- the "phenomenal world" with which we are all familiar -- rather than requiring the intervention of a human agent to digest and code the necessary information.</p>
   <P>A primary requirement of such a system is that it must
   be able to recognize complex patterns of information which are phenomen­ally similar, or are experientially related -- a process which corresponds to the psychological phenomena of "association" and "stimulus generalization". The system must recognize the "same" object in different orientations, sizes, colors, or transformations, and against a variety of different backgrounds.</p>
   <footer>Frank Rosenblatt in <cite title="The perceptron, a perceiving and recognizing automaton">The perceptron, a perceiving and recognizing automaton</cite>, 1957.</footer>
</blockquote>

Recognizing patterns (which does not imply _understanding_ of the patterns that are recognized) is a critical component of intelligent systems, and was recognized as such early on.

Pattern recognition deals with the classification and correlation of data, irrespective (as opposed to regardless) of its meaning. Classification can occur based on previously defined categories presented to the computer system as a _training set_, in which case it is called _supervised learning_. If no training set is provided it's called _unsupervised learning_ and the system defines patterns by itself--the _meaning_ of those patterns is an entirely different matter.

This field, in particular that of neural networks, has been at the center of a quantitative leap in pattern recognition, classification, and related tasks, with a set of techniques commonly referred to as Deep Learning.
