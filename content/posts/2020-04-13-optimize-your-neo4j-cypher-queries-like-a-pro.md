---
template: post
title: Optimization essentials for your Neo4j Cypher queries
slug: optimization-essentials-for-your-neo4j-cypher-queries
draft: false
date: 2020-04-15T07:02:50.481Z
description: >-
  Explaining adaptations of a few basic but important optimisations while
  dealing with Neo4j Cypher queries to improve performance.
category: Neo4j
tags:
  - Neo4j
  - Cypher
  - graphDB
  - Optimisation
---
I have been working on Neo4j for quite some time. It has been a good learning experience with it and has allowed exploring and extracting knowledge from connected data. In case you're not familiar with it, Neo4j is currently the leading vendor in the space of graph databases. 

Around a month ago, while helping on a project of a friend, I had to spend few hours trying to optimize about 10 Cypher queries that not performing good enough (query time ranged from 46786ms to 135759ms) on a QA server. After some trial and error, I had changed them all and brought down query run-time to 2367ms to 5755ms. At that time I understood why it is very necessary to focus on query optimization from the very beginning of your development cycle. So writing this one in case if someone may get help.

The **First** thing towards query optimization is to check the execution plan of your query. Neo4j provides two keywords for it:

* `EXPLAIN`
* `PROFILE` 

Both of them can be prefixed with your query to check the execution plan. Only difference between lies in the fact that `EXPLAIN` provides estimates of the graph engine processing that will occur, but does not execute the Cypher statement, while `PROFILE` provides real profiling information for what has occurred in the graph engine during the query and executes the Cypher statement.

We can use it like this: 

**`PROFILE`**`MATCH`

`(celebrity:Person)<-[:FOLLOWS*0..4]-(follower:Person)`

`return celebrity,follower limit 500`

![Neo4j Profile Query](/media/profile_neo4j.png)

**Second,** I started [indexing](https://neo4j.com/docs/cypher-manual/current/administration/indexes-for-search-performance/) the most frequently used properties of nodes of different labels. This improved the timings by a good margin. For a node, the index can be created on single or multiple nodes.

For creating a single-property index, 

`CREATE INDEX [index_name] FOR (n:LabelName) ON (n.propertyName)`

For creating a composite index,

`CREATE INDEX [index_name] FOR (n:LabelName)`

`ON (n.propertyName_1, n.propertyName_2, ..., n.propertyName_n)`

Remember that_, If you have set a constraint on any property of a node, there is no need to create index for that property._

**Third**, make sure to use parameters in maximum numbers of cypher queries is using parameter(s). If you go through [Neo4j documentation](https://neo4j.com/docs/cypher-manual/current/syntax/parameters/), you'll know how it helps in caching of execution plans.

**Fourth,** although it will be possible always, is to avoid `ORDER BY` and `DISTINCT` clauses if not needed compulsorily. They add a lot of time.

I've been still unable to fully simplify few of the things which include removal of optional paths. Like one of below format:

`MATCH A-[o?:optional]-B`

`WHERE (o is present, match B to C and D)`

`OR (o is absent, match A to E and F)`

I'll update this section later whenever I get a full-proof way to remove optional paths. If you have any suggestions on this, please help me out on twitter.

**Fifth,** If you are running updates make sure that your updates handle data of about 10k-100k records, if you have more, please batch them. 

**Sixth,** try to run tests on servers with as much less as resources available, I would recommend your local machine. 

One more suggestion from my side would be to use test/development data this is a bit close to production data. This will help against the discovery of special cases in your data; like you might find later that some nodes are heavily connected, others, not so much, and some queries perform differently for lightly and heavily connected nodes.

For Summary:

1. Try to check the query plan with `EXPLAIN` and `PROFILE.`
2. Analyze time taken not only during the execute() on the query, but also the time to iterate through the results.
3. Index your most-used properties.
4. Parameterize your queries.
5. Examine your MATCH and RETURN clauses. Include in the MATCH only those parts that are required in RETURN. The remaining which would be to filter the results can go into the WHERE.
6. Get rid of `ORDER BY` and `DISTINCT` wherever possible.
7. Optional paths can be moved from the MATCH into WHERE if you don’t needed.
8. Try to use live data as far as possible.
9. Use batches while running updates.

You can refer to these for more details:

* [Developer Manual: Query Tuning](https://neo4j.com/docs/developer-manual/current/cypher/query-tuning/)
* [Developer Manual: Execution Plan](https://neo4j.com/docs/developer-manual/current/cypher/execution-plans/)
* [Batched Efficient Updates](https://medium.com/@mesirii/5-tips-tricks-for-fast-batched-updates-of-graph-structures-with-neo4j-and-cypher-73c7f693c8cc)
* [Efficient Loading of Sub-graphs](https://medium.com/neo4j/loading-graph-data-for-an-object-graph-mapper-or-graphql-5103b1a8b66e)
