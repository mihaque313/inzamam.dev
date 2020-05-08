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

Now, we're going to run the neo4j docker image taking care of running the server on non-default ports and also creating or mounting the required folders from the desired location.

`docker run --detach --name=neo4j-instance-1 --rm \`

`--publish=7475:7474 --publish=7476:7473 --publish=7688:7687 \`

`--volume=$HOME/neo4j-instance-1/data:/data \`

`--volume=$HOME/neo4j-instance-1/import:/import \`

`--volume=$HOME/neo4j-instance-1/conf:/conf neo4j`

Let's break-down the above command.

1. `docker run …… neo4j` is to run the neo4j docker image
2. `–-detach` to run the container in the background and return the prompt.
3. `--name=neo4j-instance-1` to give the desired name to the docker instance otherwise docker will choose a random name which might not be very easy to remember if we want to refer to this session in future for some reason.
4. `-–rm` is to delete the docker instance from the list upon session termination. This is useful if we want to reuse the same name.
5. `-–publish=7475:7474 -–publish=7476:7473 -–publish=7688:7687` to publish/forward the default http, https and bolt ports to the desired ports. In this case, the http, https and bolt ports will be forwarded to the desired 7475, 7476 and 7687 respectively.
6. `--volume=$HOME/neo4j-instance-1/data:/data --volume=$HOME/neo4j-instance-1/import:/import --volume=$HOME/neo4j-instance-1/conf:/conf` to mount the desired locations for the database creation or access.

**Note**: If you are running this command for the first time, it will create the folders mentioned in –volume tag. Otherwise, it will mount the existing folders to the neo4j docker defaults.

If no error is returned then your neo4j server is running and should have been mapped to the desired ports and folders.

**3. Check the docker and neo4j server running status.**

To check the current running docker session run `docker ps`, whis should give you an output something like this:

`CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES`

`1afa157d9caa neo4j "/sbin/tini -g -- ..." 36 minutes ago Up 36 minutes 7473/tcp, 0.0.0.0:7475->7474/tcp, 0.0.0.0:7688->7687/tcp neo4j-instance-1`

To terminate this session: `docker kill neo4j-instance-1`

**Note:** You can also check the status by using: `netstsat -tunlp | grep 7475` 

To check neo4j running status: open a web browser and then navigate to

http://<hostname-of-machine>:7475 (or the port that you have used for forwarding in step 2)

It should display a page like the one below:

![](/media/neo4j1.png)

Change the bolt port to 7688 (or the port that you have used for forwarding in step 2), use user/password as neo4j/neo4j and click connect. Set new password in next screen.

It should connect you to your default graph.db database which should look something like below.

![](/media/neo4j2.png)
