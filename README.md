# Voxel Geometry

  Voxel Geometry is the next generation of Fast Builder (Or World Edit, But focus more on Geometry) based on Minecraft Game Test engine. It is turning complete, which supports native JavaScript grammar. If you are familiar with JavaScript , you can consider Voxel Geometry as a geometric library that effects on Minecraft world.

 A voxel represents a value on a regular grid in three-dimensional space. Geometry means this software is very **mathematically** and owns more features as follows for generating awesome structures.

- **Basic Geometry** : Sphere, circle, cylinder, torus, line and more.
- **Lindenmayer system** (**L-System**) : A parallel rewriting system. The recursive nature of the L-system rules leads to self-similarity and thereby, fractal-like forms are easy to describe with an L-system.
- **Turtle Graphic** : Full features and extensions of turtle graphics.
- **Functional Style** : Voxel Geometry includes a powerful simple JavaScript functional-programming toolset named [Pure Eval](https://github.com/PureEval/PureEval.git). This enables you to compose function together to construct more complex structure.
- **Transformer** : Transforming space into another by pipe, compose, scale, diffusion and more. 
- **Expression drawing** : Constructing from math expression.
- **Linear and Nonlinear Transform** : Mapping space into another one.
- **Diffusion Limited Aggression** : Simulating particles undergoing a random walk due to Brownian motion cluster together to form aggregates of such particles.
- **Markov Chains**
- **Chaos Theory**

## Installation 

​	For users , just simply download the mcpack file from the releases page (Not done yet).

- Clone the repository:

  ```shell
  git clone --recursive https://github.com/CAIMEOX/VoxelGeometry.git
  ```

- Make sure that you have nodejs and gulp installed.

  ```shell
  gulp build # Build and Load testing file for VG Viewer
  gulp # Build and deploy (Only works on windows)
  ```

## Basic Concepts

### Console

​	The **chat** window in the game is the **console**, you can use it to interact with Voxel Geometry. VG commands start with **-** , which supports JavaScript grammar. (We will ignore this flag in the following document.)

### Space 

​	Many Voxel Geometry functions will return a **Space** (A array of 3D vectors, or Block Location).

### Grammar

  Voxel Geometry supports data types like functions, arrays, numbers, strings and more. You can do everything through the combination of some basic functions.

#### Function Apply
```javascript
function(arg1, arg2, ...)
```

#### Variable

​	Define a var:
```javascript
let name = value
```

## Effect

​	Most function in Voxel Geometry is pure function (A function has no side effects), which means it **can not** do anything on Minecraft world. Only a part of function has the ability to affect the Minecraft world.

​	Most functions return Space, but this wont affect the world, you should use the function **plot** to "map" the Space into Minecraft world.

```javascript
plot(Space)
plot(sphere(5, 4)) # Generate a hollow sphere
```

​	Use the function **getpos** can get player's position and set it as the mapping **origin** of the **plot**. 

## Basic Geometry

### Sphere

​	Create a sphere with radius.

```haskell
sphere :: (radius, inner_radius) -> Space
plot(sphere(5, 4))
```

### Circle 

​	Create a circle with radius.

```haskell
circle :: (radius, inner_radius) -> Space
plot(circle(5, 4))
```

### Torus 

​	Create a torus.

```haskell
torus :: (radius, ring_radius) -> Space
plot(torus(10,8))
```

## Transformer

### scale

​	Scale up a Space

```haskell
scale :: (Space, size) -> Space
```

### pipe

​	Take the point of the previous space as the origin of the next space.

```haskell
pipe :: (Space_1, Space_2, ...) -> Space
```

### diffusion

​	Spread out points of a space by a factor.

```haskell
diffusion :: (Space, factor) -> Space
```

### move

​	Move a space into a specific point.

```haskell
move :: (Space, x, y, z) -> Space
```

### embed

​	Embed a space into another space

```haskell
embed :: (Space, Space) -> Space
```

### Array Generator

​	Construct a discrete set of points. 

```haskell
array_gen :: (xn, yn, zn, dx, dy, dz) -> Space
```

- _n : Count
- d_ : Interval 

​	With step function:

```haskell
array_gen_fn :: (xn, yn, zn, num -> num, num -> num, num -> num) -> Space
```

## L-System

## Turtle

## Diffusion Limited Aggression

