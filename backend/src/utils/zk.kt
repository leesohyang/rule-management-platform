package com.sample.utils

import org.apache.curator.framework.CuratorFramework
import org.apache.curator.framework.CuratorFrameworkFactory
import org.apache.curator.retry.RetryOneTime

fun toZKSignalFun(path:String, signal:String){

    val curatorFramework: CuratorFramework =
        CuratorFrameworkFactory.builder().connectString("127.0.0.1:2181").retryPolicy(RetryOneTime(2000)).build()!!
    curatorFramework.start()

    val isExist = (curatorFramework.checkExists().forPath(path) == null)

    if (isExist) curatorFramework.create().forPath(path, signal.toByteArray())
    else curatorFramework.setData().forPath(path, signal.toByteArray())
}

fun toZKFun(data: String, path: String, byte: Int, child: Boolean) {
    /*
    *
    *  object
    * makeSubNode: true/false
    * nodeSize: 512KB
    * releasePath: ~/~/~
    * separator: @
    *
    */

    val curatorFramework: CuratorFramework =
        CuratorFrameworkFactory.builder().connectString("127.0.0.1:2181").retryPolicy(RetryOneTime(2000)).build()!!
    curatorFramework.start()

    val testBytes = makeByteArray(data, byte)

    var count = 0

    val isExist = (curatorFramework.checkExists().forPath(path) != null)
    if (isExist) {
        println("Path exist. Delete znode")
        curatorFramework.delete().deletingChildrenIfNeeded().forPath(path)
    }

    curatorFramework.create().forPath(path)

    testBytes.forEach {
        if (child) {
            val childPath = "$path/$count"
            curatorFramework.create().forPath(childPath, it)
            println("child $count created")
            count += 1
        } else {
            println("no child")
            curatorFramework.setData().forPath(path, it)
        }
    }


}

fun makeByteArray(str: String, subByte: Int): Iterable<ByteArray> {
    val ma = mutableListOf<ByteArray>()
    val len: Int = str.toByteArray().size

    var beginBytes: Int = 0

    while (beginBytes < len) {
        if(subByte==0) break
        substringByBytes(str, beginBytes, subByte)?.let {
            ma.add(it)
            beginBytes += subByte
        }
    }

    return ma
}

fun substringByBytes(str: String, beginBytes: Int, subBytes: Int): ByteArray? {

    if (str.isEmpty()) return null
    if (beginBytes < 0) return null
    if (subBytes < 1) return null

    val endBytes: Int = beginBytes + subBytes
    val len: Int = str.length

    var beginIndex = -1
    var endIndex = 0
    var curBytes = 0
    var ch: String?

    for (i in 0 until len) {
        ch = str.substring(i, i + 1);
        curBytes += ch.toByteArray().size

        if (beginIndex == -1 && curBytes >= beginBytes) beginIndex = i

        if (curBytes > endBytes) break else endIndex = i + 1
    }

    return str.substring(beginIndex, endIndex).toByteArray()
}