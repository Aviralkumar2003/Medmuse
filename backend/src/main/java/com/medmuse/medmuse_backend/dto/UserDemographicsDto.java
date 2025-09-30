package com.medmuse.medmuse_backend.dto;

import lombok.Data;
import com.medmuse.medmuse_backend.entity.UserDemographics;

@Data
public class UserDemographicsDto {
    private Long userId;
    private int age;
    private String gender;
    private double weight;
    private String height;
    private String nationality;

    public UserDemographicsDto(UserDemographics demographics) {
        this.userId = demographics.getUser().getId();
        this.age = demographics.getAge();
        this.gender = demographics.getGender();
        this.weight = demographics.getWeight();
        this.height = demographics.getHeight();
        this.nationality = demographics.getNationality();        
    }
}
