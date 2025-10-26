package com.medmuse.medmuse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDemographicsDto {
    private int age;
    private String gender;
    private double weight;
    private String height;
    private String nationality;
}
