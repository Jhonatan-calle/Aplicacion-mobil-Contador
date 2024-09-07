# Registro de Préstamos y Deudas

Esta es una aplicación móvil creada con Expo para llevar un registro detallado de préstamos o deudas. La aplicación calcula automáticamente los intereses y permite llevar un control de los clientes, mostrando resúmenes diarios, semanales y mensuales de las transacciones, así como un campo para registrar gastos. La aplicación está diseñada para facilitar la gestión financiera en negocios de préstamos y está actualmente en uso.

## Descripción

La aplicación ofrece las siguientes funcionalidades:

- **Registro de Préstamos y Deudas**: Permite registrar préstamos o deudas con sus respectivos intereses calculados automáticamente.
- **Gestión de Clientes**: Mantiene un registro de clientes con todos sus movimientos financieros.
- **Resúmenes Financieros**: Proporciona resúmenes diarios, semanales y mensuales de la cantidad de dinero prestado, cobrado y los gastos registrados.
- **Cálculo Automático de Intereses**: Automatiza el proceso de cálculo de intereses sobre los préstamos o deudas.
- **Base de Datos en la Nube**: Utiliza Firebase como base de datos para almacenar de manera segura la información de clientes y transacciones.

## Herramientas Utilizadas

Este proyecto se ha implementado utilizando las siguientes herramientas:

- **Expo**: Un framework de desarrollo que permite crear aplicaciones móviles con React Native de manera fácil y rápida. Se utilizó para construir la interfaz de usuario y manejar la lógica de la aplicación.
- **Firebase**: Una plataforma de Google que proporciona una base de datos en tiempo real y servicios de autenticación. Se utiliza para almacenar la información de los clientes, los préstamos, las deudas y los resúmenes financieros.

## Estado del Proyecto

La aplicación está completamente funcional y actualmente en uso. Se continúa mejorando y actualizando para agregar nuevas funcionalidades y mejorar la experiencia del usuario.

## Instalación y Ejecución

Para probar o utilizar la aplicación, es necesario:

1. Clonar este repositorio.
2. Instalar Expo CLI siguiendo la [documentación oficial de Expo](https://docs.expo.dev/get-started/installation/).
3. Configurar Firebase en el proyecto, siguiendo las instrucciones proporcionadas en la [documentación de Firebase](https://firebase.google.com/docs/web/setup).
4. Ejecutar la aplicación en un simulador o dispositivo físico.

```bash
git clone https://github.com/Jhonatan-calle/Aplicacion-mobil-expo-Contador.git
cd registro-prestamos
npm install
expo start
