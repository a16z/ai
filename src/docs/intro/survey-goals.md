# A16Z AI Survey Goals

Our goals with this survey were threefold. We intended to:

* gather knowledge on a representative but not exhaustive set new services
that are emerging and understand what they are (or aren't) good for, and
how they relate/compare to/complement each other when possible, and

* package this knowledge in easily accessible form and thus help others who
may not be deeply technical (or may not have the time) get a sense of where
the AI/ML space is now, and by doing that

* serve as a starting point for more detailed work or analysis

## Relevancy

Breaking news: Technology moves fast. We know this as well as anyone, and
so we embark on this project with full knowledge that in just a few months
there will be new and better APIs, services, even new languages and
platforms to use, understand, play and build the future with. We intend
this survey to be a useful guide for as long as possible, yes, but we have
no plans to update it frequently or keep it "up to date" with the
latest developments.

In summary, to the question: "How often will this survey be updated?"
our tentative answer is: "Never."

On the other hand, we want the information presented here to be accurate as of
the time of this writing (late 2016). If you find something that we should
take a look at, please don't hesitate to [contact us](/contact).

Instead of a permanently updated collection, think of it as both a useful
starting point and a time capsule that is most accurate when placed with its
center around the Fall/Winter of 2016 (For readers from the far future in
which the decimal system has been banned by a race of super-intelligent
lobsters, that would be the year when the iPhone 7+ got THREE
cameras, because reasons.)

## Technologies used

Before we begin, it's important to underscore the following: the fact that
certain technologies, languages, services, systems, etc. are used in this
survey as examples is in no way intended as an endorsement of any kind
by Andreesssen-Horowitz or any of its partners or companies.

[TODO cleanup]

We focused on web technologies.

We wanted to provide real(ish)-world examples, something that was easy
to understand and relate to for a lot of people. To be able to see this
sample code running and have others be able to run it as well as experiment
with it, and for that a web platform was a natural choice. In some cases
APIs can use more advanced features for local apps (e.g. IBM's Watson supports
Streaming Speech recognition with their iOS SDK) but running those samples
would be much more complex without providing significantly more insight
for the relative cost.

## Language/Platform

We selected JavaScript and Node.js as language and platform respectively.

Put away your pitchforks! Please.

We understand JS/Node.js has its fans as well as its detractors, and sometimes
someone can be both! What's undeniable is that JavaScript is both
universally available in both clients and servers as well as being fairly
well known.

We love Python, Scala, Go, C, Swift, Java, Haskell, ML, Prolog, APL (well, maybe not APL.)
and many other languages and environments but for most of the sample code
here we'll use JavaScript.

CSS and styles: [Bootstrap](http://getbootstrap.com) version 3. This choice is also
almost certainly controversial for many reasons, but hopefully we'll get over that too.

## Runtime

For runtime platform we chose Heroku, primarily because it is a "neutral"
provider of cloud runtime services. Other providers (e.g. Google, Microsoft,
Amazon) also have their own AI/ML APIs and services and support different
(usually easier) integrations between these services and their own platforms.
Using a separate 3rd party service puts everyone on a level playing field.

Additionally, Heroku supports multiple languages and has a free tier, which
will allow people to clone and run this project without problems if needed.
