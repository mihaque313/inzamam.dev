---
template: post
title: Using Docker to spin-up multiple neo4j server instances on same machine
slug: docker-for-multiple-neo4j-server-instances-on-same-machine
draft: false
date: 2020-05-08T19:30:26.880Z
description: >-
  Discussing how to use Docker to spin-up multiple neo4j server instances on
  same machine.
category: Neo4j
tags:
  - Neo4j
  - graphdatabase
  - docker
  - linux
---
All those working on neo4j might be aware of the fact that on instance of neo4j server can mount only one database at a time. Many a times we come across situations where we have to setup more than one neo4j database, and for that purpose we have to bring up separate neo4j server instance for each database we need, which involves doing a hell lot of manual steps to download installation tarballs, pushing it to different locations on machine, changing ports in configs files, etc. Here, in situation like this docker comes quit handy.  

The key to using more than one neo4j servers simultaneously is to use different ports for http, https and bolt connections which is quite easy to do with the docker image. For my purpose, I configured neo4j in such a way that it can access the database from a non-default location. 

As using docker is invloved here, I'm assuming you already have docker installed on your linux machine. So, lets get our hands dirty. 

We'll follow these steps:

**1. Pulling the neo4j docker image**

`docker pull neo4j`

**2. Running neo4j docker image**

 By default, the neo4j docker image mounts the following folders:

`home: /var/lib/neo4j`

`config: /var/lib/neo4j/conf`

`logs: /var/lib/neo4j/logs`

`plugins: /var/lib/neo4j/plugins`

`import: /import`

`data: /var/lib/neo4j/data`

`certificates: /var/lib/neo4j/certificates`

`run: /var/lib/neo4j/run`

These directories may correspond to the already existing directories on the system. In my case, I already had a neo4j community server running on my machine so all these locations were there and were being used by the server. Therefore, I had to provide a custom location that would provide the same information. These locations would not be there in your computer if you have not installed the server version and only intending to use the docker image. To my knowledge the most import of the above-mentioned folders are data this is where your actual database will be created/stored, import to put for example CSV files for import, conf to put neo4j.conf file.
