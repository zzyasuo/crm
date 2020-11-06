package com.shsxt.crm.query;

import com.shsxt.crm.base.BaseQuery;

/**
 * 营销机会查询类
 */
public class SaleChanceQuery extends BaseQuery {

    private String customerName;//客户名
    private String createMan;//创建人
    private String state;//分配状态 1=已分配  0=未分配

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCreateMan() {
        return createMan;
    }

    public void setCreateMan(String createMan) {
        this.createMan = createMan;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
