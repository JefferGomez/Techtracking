package com.devs.TechTraking.service;

import com.devs.TechTraking.model.Repuesto;
import com.devs.TechTraking.repository.RepuestoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepuestoService {

    private final RepuestoRepository repuestoRepository;

    public RepuestoService(RepuestoRepository repuestoRepository) {
        this.repuestoRepository = repuestoRepository;
    }

    public Repuesto save(Repuesto repuesto) {
        return repuestoRepository.save(repuesto);
    }

    public List<Repuesto> findAll() {
        return repuestoRepository.findAll();
    }

    public Repuesto findById(String serie) {
        return repuestoRepository.findById(serie).orElse(null);
    }

    public void delete(String serie) {
        repuestoRepository.deleteById(serie);
    }
}
