package com.tableManager.tableManager.model;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    @Column(name = "password_reset_token")
    private String passwordResetToken;
    private boolean enabled = false;
    private boolean hasTrial = true;
    private LocalDateTime trialDate;
    private LocalDateTime trialEndDate;
    private LocalDateTime subscriptionStartDate;
    private LocalDateTime subscriptionEndDate;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DataTable> tables=  new ArrayList<>();

}
