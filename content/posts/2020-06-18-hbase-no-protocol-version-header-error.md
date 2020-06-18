---
template: post
title: HBase 'No protocol version header' error
slug: hbase-No-protocol-version-header-error
draft: false
date: 2020-06-17T19:51:09.309Z
description: HBase-No-protocol-version-header-error
category: HBase
tags:
  - Cloudera
  - HBase
  - happybase
  - python
---
Hi there,

Earlier today, I faced a problem: I had a task that needed python [happybase](https://happybase.readthedocs.io/en/latest/index.html) to do the operation on Hbase.

![Error mesage screenshot: "No protocol version header error"](/media/no_protocol_ver_header.png)

I received: "No protocol version header error"

Finally, I resolved this problem after digging up Cloudera docs.

First of all, I have to declare this before going further: the Hbase thrift server was opened before the above issue happened.

I searched for this HBase config setting in CM:

`hbase.regionserver.thrift.http`

It was checked. In /etc/hbase/conf/hbase-sit.xml, It's value was '_true'_

I found a link: [_https://github.com/wbolster/happybase/issues/161_](https://github.com/wbolster/happybase/issues/161)

![](/media/thrift_hbase__ss.png)

So, I unchecked it. ( In hbase-sit.xml, it becomes 'false' )

Then restarted Hbase service, and problem got solved

I saw a lot of people had this issue, so sharing here in the hope it would be helpful.
