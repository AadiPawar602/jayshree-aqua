package com.jayshreeaqua.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jayshreeaqua.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class UserDetailsImpl implements UserDetails {

    private final Long userId;
    private final String email;
    private final String fullName;
    private final String role;

    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(User user) {
        this.userId   = user.getUserId();
        this.email    = user.getEmail();
        this.fullName = user.getFullName();
        this.role     = user.getRole().name();
        this.password = user.getPasswordHash();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired()  { return true; }
    @Override public boolean isAccountNonLocked()   { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
