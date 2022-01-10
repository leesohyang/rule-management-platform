package com.sample.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.header.Header
import com.sample.data.header.HeaderInfo
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

class HeaderService {

    //TODO:: type live인거 찾아서 다 deactive 하고, live 인 versiom을 가져오는 function, 그리고  restore 했을 때
    // version 정보를 가지고 deactive -> live로 바꾸는게 필요함. version을 따로 빼는게 나을까? 아니, 어짜피 정렬도 못할건데.. updatedAt 추가하기

    fun restoreHeader(version: String) = transaction {
        var result: HeaderInfo = HeaderInfo()
        TransactionManager.current().exec("select * from \"header\" h where info ->> \'ver\' = \'$version\'"){
            rs ->
            while(rs.next()){
                var content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue<HeaderInfo>(content)
            }
        }
        result
    }

    fun deActive () = transaction {
        var result: HeaderInfo = HeaderInfo()
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"dead\"\', false) where info ->> \'type\'=\'live\'" )
    }

    //TODO:: updatedAt 도 바꾸기. history table에 history 별 header 룰 버전도 보여주기.
    fun active (version: String) = transaction {
        var result: HeaderInfo = HeaderInfo()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"live\"\', false), updatedat=\'$now\' where info ->> \'ver\'=\'$version\'" )
    }

    fun selectLiveHeader() = transaction {
        var result: HeaderInfo = HeaderInfo()
//        TransactionManager.current().exec("select * from \"header\" h  order by h.updatedat desc limit 1"){
        TransactionManager.current().exec("select * from \"header\" h  where h.info ->> 'type'='live'"){
            rs ->
            while(rs.next()){
                var content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue<HeaderInfo>(content)
            }
        }
        result
    }
    fun insert (req: HeaderInfo) = transaction {
        val mapper = jacksonObjectMapper()
        val conn = TransactionManager.current().connection
        val now: String = LocalDateTime.now().format(formatter).toString()
        val query = "INSERT INTO header\n" +
                "(\"info\", \"updatedat\")\n" +
                "VALUES('${mapper.writeValueAsString(req)}', '${now}')\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }


}