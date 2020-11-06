package com.shsxt.crm.dao;

import com.shsxt.crm.base.BaseMapper;
import com.shsxt.crm.query.SaleChanceQuery;
import com.shsxt.crm.vo.SaleChance;

import java.util.List;
import java.util.Map;

public interface SaleChanceMapper extends BaseMapper<SaleChance,Integer> {

    //多条件查询影响机会列表
    List<SaleChance> querySaleChanceByParams(SaleChanceQuery saleChanceQuery);



}