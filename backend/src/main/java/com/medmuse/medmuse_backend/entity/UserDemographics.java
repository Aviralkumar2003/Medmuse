package com.medmuse.medmuse_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name= "user_demographics")
public class UserDemographics {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private int age;
    private String gender;
    private double weight;
    private String height;
    private String nationality;

    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    public UserDemographics(int age, String gender, double weight, String height, String nationality, User user) {
        this.age = age;
        this.gender = gender;
        this.weight = weight;
        this.height = height;
        this.nationality = nationality;
        this.user = user;
    }
}
