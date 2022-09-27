# Overview

This document serves as a guide to creating Jira tickets for coins that will be researched. It attempts to structure the research for each coin into appropriate stories that are not only managable in a sprint but broken down enought to be split between people.

There are different pieces that go into each catagory and an order to doing research on them should be established.

## Naming Convention

As a (person/type of user), I want (something) so that (some reason).

Example: As a blockchain research engineer I want to implement x coin working in hot so that I have a better understanding of how x coin works.

## Documentation

* Start working on a hot implementation of the coin
* Key/Address Generation
* Signing Algorithm
* Transaction Creation
* Purpose of the Coin (What's it about?)

## Cold

* Create Profile for Coin
* Add Signature and Key Derivation Algorithm if Needed
* Add Utils if Needed
* Create Tests for the Coin
* Add Coin to CLI
* Test the API with the Coin

## Builders

* Create Builder Outline (Don't fill in)
* Add CLI Profile for Coin
* Fill in Builder for Coin
* Add Utils if Needed
* Add Create Transaction and Request File Tests for Coin
* Update Builder API

## Last Step

* Test End to End functionality

