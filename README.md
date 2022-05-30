# Comunicación entre contenedores

El presente proyecto permite crear una conexión entre un servidor de Node.js con una base de datos MySQL, a la vez que dispone de algunos métodos HTTP para realizar algunas peticiones al servidor.

## Para ejecutar las pruebas

- El puerto del sevidor es el 3001
- Para realizar las peticiones se emplea el comando *curl*.
- En los ejemplos mostrados se usa el localhost, puede cambiar la dirección a la ofrecida por playwithdocker.



### Ejecución punto 1
El siguiente código permite saber si la conexión a la base de datos está establecida correctamente.

```
curl -X GET localhost:3001/connection
```

### Ejecución punto 2

El siguiente código permite crear un nuevo usuario con nombre de usuario **ralph**, contraseña **12345678** y nrc **3425** .


```
curl -X POST --header 'Content-Type: application/json' -d '{"username": "ralph", "password": "12345678", "nrc": 3425}' localhost:3001/adduser
```

### Ejecución punto 3

El siguiente código permite autenticar al usuario **ralph** creado en el punto anterior.

```
curl -X POST --header 'Content-Type: application/json' -d '{"username": "ralph", "password": "12345678", "nrc": 3425}' localhost:3001/authenticate
```

### Ejecución punto 4

El siguiente código permite eliminar a todos los usuarios creados.

```
curl -X DELETE localhost:3001/delete
```

### Ejecución punto 5

El siguiente código permite agregar usuarios por medio de un archivo **json** el cual se encuentra en la ruta **/home/leonardo/Documents/file.json**, este archivo lo puede encontrar en el presente proyecto con el mismo nombre.

```
curl -X POST --header 'Content-Type: application/json' -d '@/home/leonardo/Documents/file.json' localhost:3001/addusers
```

## Autores ✒️

* **Leonardo Aguilera**
* **Camilo Sinning** 
* **Felipe de Lima** 



