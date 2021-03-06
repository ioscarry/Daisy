package com.yourong.web.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

/**
 *  忘记密码 form 表单
 * @author pengyong
 *
 */
public class MemberUpdatePasswordDto {
	
    //手机号码
    private Long mobile;
    //图形验证码
    private String pngCode;
    //短信验证码
    private String smsCode;
    @NotBlank
    @Size(min = 6, max = 16,message="10011")
    @Pattern(regexp = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,16}",message="10014")
    private String password;
    @NotBlank
    @Size(min = 6, max = 16,message="10011")
    @Pattern(regexp = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,16}",message="10014")
    private String repassword;
    
    private Long id;
    
    
    private int checkType;
    
    
    public Long getMobile() {
        return mobile;
    }
    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }
    public String getPngCode() {
        return pngCode;
    }
    public void setPngCode(String pngCode) {
        this.pngCode = pngCode;
    }
    public String getSmsCode() {
        return smsCode;
    }
    public void setSmsCode(String smsCode) {
        this.smsCode = smsCode;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRepassword() {
        return repassword;
    }
    public void setRepassword(String repassword) {
        this.repassword = repassword;
    }
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getCheckType() {
		return checkType;
	}
	public void setCheckType(int checkType) {
		this.checkType = checkType;
	}
	
    
        
}
