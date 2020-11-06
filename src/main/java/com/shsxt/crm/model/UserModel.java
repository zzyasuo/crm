package com.shsxt.crm.model;

/**
 * 用来封装返回的用户对象
 */
public class UserModel {

//    private Integer userId;  //用户ID
    private String userIdStr;   //编码后的用户ID
    private String userName;
    private String trueName;

    public UserModel() {
    }

    public UserModel(String userIdStr, String userName, String trueName) {
        this.userIdStr = userIdStr;
        this.userName = userName;
        this.trueName = trueName;
    }

    public String getUserIdStr() {
        return userIdStr;
    }

    public void setUserIdStr(String userIdStr) {
        this.userIdStr = userIdStr;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTrueName() {
        return trueName;
    }

    public void setTrueName(String trueName) {
        this.trueName = trueName;
    }
}
