package com.yourong.common.baidu.yun.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface RangeRestrict {
	
	public long minLength() default Long.MIN_VALUE;
	
	public long maxLength() default Long.MAX_VALUE;
	
}
