---
template: post
title: Shell loops to process text files? Think again!
slug: think-again-before-using-shell-loops-for-processing-text-files
draft: false
date: 2020-04-10T15:12:13.949Z
description: >-
  My take on why one should avoid using loops in shell scripts when dealing with
  file processing. Have tried to explain the disadvantages and inefficiencies
  behind the scene. Then discussed few of the alternatives, and a comparison
  with programming languages.
category: Shell Scripting
tags:
  - linux
  - shell
  - bash
  - scripting
  - file-processing
---
Holla folks! How's lockdown going on? 😁

I'm writing this as first entry to this what I think could live on to be called my blog. A lot of procrastination, a hell lot of ifs and buts on how should I start writing, and then yesterday I decided to write on it!

I am not sure whether you have used shell scripts or are you write them regularly. In any case, just take this post as my opinion, not as set of hard-bound rules . 

Lately, I have come across many scripts and people writing them for the purpose of processing text files, having things like this:

```
while read row; do
```
```
   echo $row | cut -c3
```
```
done
```
or
```
for row in `cat file`; do
```
```
   foo=`echo $row | awk '{print $2}'`
```
```
   echo blahblah $foo
```
```
done
```
Those are naive literal translations of what you would do in languages like C or python, but that's not how you do things in shells, and those examples are very inefficient, completely unreliable, and if you ever manage to fix most of the bugs, your code becomes illegible(I will explain this later.)

**Conceptually,** in these languages, building blocks are just one level above machine instructions. You tell your processor what to do and then what to do next. You open that file, you read that many bytes, you do this, you do that with it.

Shells are a higher level language. I would say it's not even a language, they're just all command line interpreters. The job is done by those commands you run and the shell is only meant to orchestrate them. 

I think shell is more like a plumbing tool. You open the files, setup the pipes, invoke the commands. and when it's all ready, it just flows without the shell doing anything. The tools do their job concurrently, efficiently at their own pace with enough buffering so as not one blocking the other, it's just beautiful and yet so simple.

Let's take an example of `cut`, it is like opening the kitchen drawer, take the knife, use it, wash it, dry it, put it back in the drawer. 

When you do:

```
while read row; do
```
```
   echo $row | cut -c3
```
```
done
```
It's like for each line of the file, getting the `read` tool from the drawer, read a line, wash your read tool, keep it back to the drawer. Then schedule a meeting for the `echo` and `cut`tool, get them from the drawer, invoke them, wash them, dry them, place them back in the drawer. This process  keeps repeating till the last line.

You can just read the above para as: slicing an onion but washing your knife and putting it back to the drawer between each slice. But Here, the obvious better way is to get your cut tool from the drawer, slice your whole onion and put it back in the drawer after the whole job is done.

In other words, in shells, especially to process text, you should invoke as few utilities as possible and have them cooperate to the task, not run thousands of tools in sequence waiting for each one to start, run, clean up before running the next one. 

Talking in terms of **performance,** When you do a `fgets()` or `fputs()` in C, that's a function in stdio. stdio keeps internal buffers for input and output for all the stdio functions, to keep away from to doing expensive system calls too often.
But, The corresponding even builtin shell utilities (`read`, `echo`, `printf`) can't do that.

* `read` is meant to read one line. If it reads past the newline character, that means the next command you run will miss it. So read has to read the input one byte at a time. 
* `echo`, `printf` can't just buffer its output, it has to output it straight away because the next command you run will not share that buffer.

And especially, when we get on to processing the big file, which could have thousands or millions of lines, it is not fine for the shell script to take a significant fraction of a second (even if it's only a few dozen milliseconds) for each line, as that could add up to hours. 

**What is the alternative?**

Instead of using a loop to look at each line, we need to pass the whole file through a pipeline of commands. This means that, instead of calling the commands thousands or millions of time, the shell calls them only once. It's true that those commands will have loops to process the file line-by-line, but they are not shell scripts and they are designed to be fast and efficient. 

Unix has many wonderful built in tools, ranging from the simple to the complex, that we can use to build our pipelines. Simple tools include `head`, `tail`, `grep`, `sort`, `cut`, `tr`, `sed`, `join`(when merging 2 files), and `awk` one-liners, among many others. When it gets more complex, and you really have to apply some logic to each line, `awk` is a good option. 

I'm giving you a simple example from a script I've written:

`cat file.txt | grep -w "|" | grep -Ewo "[0-9]| sed '4q;d' | awk '{$1=$1};'`

Here, 

* I'm pushing contents of file.txt to pipe using `cat file.txt`
* then selecting only lines containing '|' using `grep -w "|"`
* selecting lines containing only digits by, `grep -Ewo "[0-9]`
* then just selecting the 4th line from the file using, `sed '4q;d'`
* and in last, removing white-spaces by `awk '{$1=$1};'`

**Finally**, I would close this on note that Its all your call to decide what to use based on the situation and your requirements. And with a good old proverb of "_horses for courses",_ I would suggest that next time take a pause before thinking: '**I'm going to do this in shell'!**😄

In case if you want to dig into some deeper details, I'm leaving with few good articles/answer:

* [Stéphane Chazelas answer on stackoverflow on: Understanding “IFS= read -r line”](https://unix.stackexchange.com/questions/209123/understanding-ifs-read-r-line/209184#209184)  
* [Alternative solution to nested loops in shell programming](https://www.unix.com/homework-and-coursework-questions/261027-alternative-solution-nested-loops-shell-programming.html)  
* [10 tips to improve Performance of Shell Scripts](www.theunixschool.com/2012/06/10-tips-to-improve-performance-of-shell.html)


Tada!
