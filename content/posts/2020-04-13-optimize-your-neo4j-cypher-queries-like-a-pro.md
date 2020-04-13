---
template: post
title: Optimize your Neo4j Cypher queries like a pro
slug: optimize-neo4j-cypher-queries-like-a-pro
draft: false
date: 2020-04-13T07:02:50.481Z
description: >-
  Explaining to adapt a few basic but important optimisations while dealing with
  neo4j cypher queries.
category: Neo4j
tags:
  - neo4j
  - cypher-query
  - graphDB
---
I have been working on Neo4j for quite some time. It has been a good learning experience and has given opportunity to explore more on graph databases along the way. In case you're not familiar with it, Neo4j is currently the leading candidate in the space of graph databases. 

few months ago, I had to spent few hours trying to optimize about 5 complex Cypher queries that not performing good enough (query time ranged from 46786ms to 135759ms) on a QA server. After some trial and error, I had changed them all and brought down query run-time to 2367ms to 5755ms. At that time I understood why its very necessary to focus on query optimization from the very beginning of your development cycle. So writing this one in case if someone may get help.

**First** thing towards query optimization is to check execution plan of your query. Neo4j provides two keywords for it:

* `EXPLAIN`
* `PROFILE` 

Both of them can be prefixed with your query to check the execution plan. Only difference between lies in the fact that `EXPLAIN` provides estimates of the graph engine processing that will occur, but does not execute the Cypher statement, while `PROFILE` provides real profiling information for what has occurred in the graph engine during the query and executes the Cypher statement.

We can use it like this: 

**`PROFILE`**`MATCH (child:Territory)-[rel:TERRITORY_TO_PARENT*]->(parent:Territory)`

`return child,parent limit 500`

![Neo4j Profile Query](/media/profile_neo4j.png)

**Second,** I started indexing the most frequently used properties of nodes of different labels. This improved the timings by good margin.  \*\*\*\*

``
