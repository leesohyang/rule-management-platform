//package com.sample.utils
//
//import org.jetbrains.exposed.sql.transactions.TransactionManager
//import java.sql.ResultSet
//
//fun <T:Any> String.execAndMap(transform : (ResultSet) -> T) : List<T> {
//    val result = arrayListOf<T>()
//    TransactionManager.current().exec("") { rs ->
//        while (rs.next()) {
//            result += transform(rs)
//        }
//    }
//    return result
//}

//
//"select u.name, c.name from user u inner join city c where blah blah".execAndMap { rs ->
//    rs.getString("u.name") to rs.getString("c.name")
//}