package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Revision;
import com.devs.TechTraking.repository.RevisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RevisionService {

    private final RevisionRepository revisionRepository;

    public RevisionService(RevisionRepository revisionRepository) {
        this.revisionRepository = revisionRepository;
    }

    public Revision saveRevision(Revision revision) {
        return revisionRepository.save(revision);
    }

    public List<Revision> getAllRevisiones() {
        return revisionRepository.findAll();
    }

    public Revision getRevisionById(Long id) {
        return revisionRepository.findById(id).orElse(null);
    }
}
