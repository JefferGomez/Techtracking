package com.devs.TechTraking.enums;

public enum NombreRol {

    SUPERADMIN(1),
    ADMIN(2),
    TECNICO(3),
    ALMACENISTA(4);

    private final int id;

    NombreRol(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static NombreRol fromId(int id) {
        for (NombreRol rol : NombreRol.values()) {
            if (rol.id == id) {
                return rol;
            }
        }

        throw new IllegalArgumentException("ID de rol inválido: " + id);
    }
}
