
package com.yourong.common.util;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 绑定JSON/自定义 数据到 Map
 * <p>
 * 默认自定义的MethodArgumentResolver是放在预定义之后，而且如果我们使用Map接收时，会自动绑定到Model上。 请参考<a
 * href="http://jinnianshilongnian.iteye.com/blog/1698916"> SpringMVC强大的数据绑定（1）——第六章 注解式控制器详解——跟着开涛学SpringMVC</a>
 * 第六部分：Model、Map、ModelMap
 * <p>
 * 期待springmvc未来版本可以自定义参数解析器顺序
 * </p>
 *
 * @author
 * @param <K>
 * @param <V>
 */
public class MapWapper<K, V> {

    private Map<K, V> innerMap = new HashMap<K, V>();

    public void setInnerMap(Map<K, V> innerMap) {
        this.innerMap = innerMap;
    }

    public Map<K, V> getInnerMap() {
        return innerMap;
    }

    public void clear() {
        innerMap.clear();
    }

    public boolean containsKey(Object key) {
        return innerMap.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return innerMap.containsValue(value);
    }

    public Set<java.util.Map.Entry<K, V>> entrySet() {
        return innerMap.entrySet();
    }

    @SuppressWarnings("unchecked")
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        MapWapper<K, V> other = (MapWapper<K, V>) obj;
        if (innerMap == null) {
            if (other.innerMap != null) return false;
        } else if (!innerMap.equals(other.innerMap)) return false;
        return true;
    }

    public V get(Object key) {
        return innerMap.get(key);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((innerMap == null) ? 0 : innerMap.hashCode());
        return result;
    }

    public boolean isEmpty() {
        return innerMap.isEmpty();
    }

    public Set<K> keySet() {
        return innerMap.keySet();
    }

    public V put(K key, V value) {
        return innerMap.put(key, value);
    }

    public void putAll(Map<? extends K, ? extends V> m) {
        innerMap.putAll(m);
    }

    public V remove(Object key) {
        return innerMap.remove(key);
    }

    public int size() {
        return innerMap.size();
    }

    public Collection<V> values() {
        return innerMap.values();
    }

    @Override
    public String toString() {
        return innerMap.toString();
    }

}
