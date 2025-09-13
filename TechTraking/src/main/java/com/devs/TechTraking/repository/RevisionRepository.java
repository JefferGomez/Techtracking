package com.devs.TechTraking.repository;

import com.devs.TechTraking.model.Revision;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevisionRepository extends JpaRepository<Revision, Long> {
}
