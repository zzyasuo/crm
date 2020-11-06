package com.shsxt.crm.base;


/**
 * Layui的数据表格需要的分页参数
 *      page 当前页
 *      limit 每页显示的数量
 */
public class BaseQuery {
    private Integer page=1;
    private Integer limit=10;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }
}
