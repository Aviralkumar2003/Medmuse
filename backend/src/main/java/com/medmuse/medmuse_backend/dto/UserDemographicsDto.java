package com.medmuse.medmuse_backend.dto;

import lombok.Data;

@Data
public class UserDemographicsDto {
    private int age;
    private String gender;
    private double weight;
    private String height;
    private String nationality;
}
