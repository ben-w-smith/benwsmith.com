---
title: "The Unbuilt Game"
date: 2026-07-01
category: Essay
excerpt: "I spent a couple of weeks designing a real-time strategy game around a single bet. The sim told me the bet was too small to feel, and that turned out to be the most useful thing it could have said."
---

I love RTS. I played Tiberian Sun seriously, and StarCraft II after that, seriously enough that I was actually trying to get good at it, studying it, grinding it, not just clicking around. For long stretches of my life it was my main entertainment, the thing I reached for outside of the usual TV-and-background-noise. So what follows isn't a tourist taking shots at the genre. It comes from someone who loves it.

So this year I tried to design one of my own. I want to be precise about the verb: designed, not built. Over a couple of weeks: four research passes, a full design bible, a combat simulator I could run headless to check whether the core idea actually held. It all rested on a single bet, and I spent those weeks iterating on it: a handful of variations on the same attention idea, each one asking the same two things: does this work, and does it jazz with me? Then I stopped.

I stopped because the sim kept telling me something I didn't want to hear, and it took me an embarrassingly long time to realize it was doing me a favor.

## The Chore

The thing I keep coming back to is this: RTS didn't fade because it was too hard to *think* about. It faded because it was too hard to *do*. Take StarCraft II, the one I put real hours into, even if the original StarCraft owns the deeper pro legacy. At the top it's a real-time chess match, two players reading each other through the fog. But underneath that ceiling is a floor made of pure chores: build the worker, build the next worker, re-queue production, split your units so they don't clump and die to one spell. None of it is a decision. It's manual labor you run hundreds of times a match, and to run it at speed you've memorized a whole keyboard of shortcuts: a piano-esque dance across the hotkeys just to keep the machine fed. That's the chore. If your hands can't keep up, you lose to someone who out-clicked you, not out-thought you.

And here's the part that reframed it for me: the fast-hands requirement hides what most players are actually losing on. [Thompson's 2013 study of 3,360 players](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0075129) found the thing gating you below the pro tier isn't click speed, it's your perception-action cycle, how fast you *look at the right thing and decide*. Which, to me, says the keyboard dance was never the real difficulty, just a tax bolted on top of the part that already mattered.

Up close, that tax is a brutal game of Simon Says: a memory-and-dexterity drill you run between your real moves, and if you botch it you don't get to make the real move at all. Losing to it leaves a specific, bitter taste, and the cleanest way to see why is chess. I can lose a game of chess and still respect the loss, because the decisions were mine and the fix is to think better next time. Simon Says doesn't give you that. You can read the board better than your opponent and still lose because your hands slipped on the minigame in between. Getting out-thought feels fair. Getting out-drilled doesn't.

## Attention, not fingers

The game I designed had one north star: keep StarCraft II's attention-allocation ceiling, delete its rote-execution floor. You never lose to forgetting to build a worker. You lose to triage: to spending your attention on the wrong decision while a more important one, somewhere else on the map, quietly goes wrong.

I had a clean test for what to cut. For any action, ask: does the payoff go up if you do it more times per minute? If yes, it's a chore: automate it, no skill lost. Building workers passes, so the game does it for you; deciding *when* to stop making workers and swing into an army doesn't: that's a read under uncertainty, so you keep it. Automate what your hands do, amplify what your mind does.

And there's a hard cap on speed. Past a low baseline of clicks, enough to give your orders and no more, faster hands stop buying you anything. What still scales, and scales hard, is attention: a group you're actively watching and commanding is worth far more than the same units left to a-move, idle, or patrol. That's the part I find most fun, and the one thing I wanted to keep intact. Speed gets a ceiling. Attention doesn't.

Underneath it all is the actual claim. The scarce resource in this game isn't your fingers. It's your attention. Your economy and your units run *fine* unattended: competent, not great. Attention is the thing that turns fine into great. You've only got one pair of eyes, there's always more worth looking at than you can reach, and the entire game is deciding where to spend the look. I still think that's a genuinely good idea for a strategy game.

The feeling I was actually chasing has a better home than games: fighter pilots. Take an F-16. The radar isn't automated: you don't get to tell the jet "point the dish at that bandit and lock him up." You're flying the aircraft and running the radar yourself, and the radar has several modes, each with its own limitations, and it's on you to pick the right one, sweep the sky, find the other plane, and get the lock, all at once, all under load. That's cognitive triage. No move is cleanly correct, so the skill is making the best call you can with what you can see and immediately moving to the next problem. That's the experience I wanted an RTS to hand you. Not the memorized keyboard sequence. The cockpit.

## The bet

But a good north star isn't a game. The game lived or died on one mechanic, and I knew it going in.

Call it the deathball problem. In StarCraft II, a big army is *more* rewarding to micro, not less: mass marines still want splitting, mass blink stalkers still want blinking, so the richest player with the biggest ball also gets the most out of paying attention. The rich get richer. That's a snowball, and it's the opposite of what I wanted.

So the bet was this: design the units so that a *massed* force is attention-flat. Send your deathball across the map on a-move and babysitting it changes nothing: the attention is wasted, because there's nothing a clever click can add to an already-overwhelming force. But a small, scrappy, outnumbered force? That rewards attention enormously. Which flips the whole dynamic. The player who's *behind*, with fewer units, gets more leverage per glance than the player who's ahead. Attention would become a comeback engine, for free, baked into the roster.

No shipped RTS I know of does this on purpose. StarCraft II actively does the reverse. If I could make it hold, I'd have something new. This was the part I actually cared about; everything else was assembly.

## Where it went flat

I built the sim and went looking for the effect. It was there. It was also too small to feel.

The main lever, the thing you earn by paying attention to a unit, came out to about a sixteen percent damage bump. On paper, fine. In a fight, the gap between a-moving your whole army and micromanaging it perfectly was one or two units, out of the entire force. I built a second faction (the design had a few) with a completely different attention mechanic (hold your ground and let your units ramp up versus just ignoring them), and holding drew with ignoring. Only actively juggling your focus badly actually lost. I swept around eighty different configurations of the numbers. The answer kept coming back the same: the lever is real, and I think it sits below the threshold where a human would actually feel it.

The one place attention *did* start to matter was at scale: three separate fights happening at once, one pair of eyes, forced to triage. Rotate your attention and you clear a bit over two of the three fronts; ignore it and you clear about one. That gap is real. But here's the letdown: at that point what you're feeling isn't my clever roster mechanic. It's just scarcity. Too much happening, not enough you. And that's not a new game. That's every RTS ever made.

## The wall

So I hit a wall. Not the dramatic kind. The quiet, deflating kind, where the work felt solid and the answer was just *meh*. I'd done careful, honest, red-teamed work (I'd tried hard to prove my own idea wrong and mostly succeeded), and it kept returning flat. At some point I told the AI I was working with that this RTS sucked and RTS is a hard problem. Both true. Neither one the point.

The point took me a while to see, because I was measuring the project by the wrong ruler.

## Cheap to be wrong

The whole time, I thought the goal was a game. It wasn't. The goal was to find out, as cheaply as I possibly could, whether the game was worth building. And I got my answer. A confident "not like this," for the price of a couple of weeks and a Python script.

Not a year of building. Not a team. Not a launch that quietly flops while I tell myself the marketing was wrong. A couple of weeks and a script.

The best framing I have for it comes from drug trials. A compound that fails in a small early trial isn't a tragedy, it's the entire system working exactly as designed. The failure is *cheap* there, and catastrophically expensive later, so you engineer everything to surface it as early as you can. Science calls the good version of this falsification: you try to kill your own idea while killing it is still affordable, and the ideas that survive that are the only ones worth your real money. I killed mine in a simulation. That's a good day, not a bad one.

And it's not like I walked away empty-handed. The diagnosis still feels right to me (the read on why the genre stalled), and it's the part I'd actually publish. The specific cure is the thing that's shaky. What I have now is a stack of documents that lay out an idea I still think is novel and then show, with numbers, exactly where and why it doesn't work yet. Which feels rarer than a half-finished game, and more useful, at least to me.

## The Unbuilt Game

I don't have a playable I'm proud of. I don't have a game at all. What I have is a decision I made on evidence, before it cost me anything real: this isn't worth building yet, and here's the proof.

For a while that felt like quitting. I don't think it was. Being wrong cheaply, and fast, is a skill I want more of. And for a hobby project, this felt like a good rep at it. The game was never really the point. Figuring out I didn't need to build it was.
