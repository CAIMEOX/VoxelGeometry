# <center>Voxel Geometry</center>

![logo](./gallery/logo.png)

Voxel Geometry is the next generation of Fast Builder (Or World Edit, But focus more on Geometry) based on Minecraft Game Test engine. It is turning complete, which supports native JavaScript grammar. If you are familiar with JavaScript , you can consider Voxel Geometry as a geometric library that effects on Minecraft world.

A voxel represents a value on a regular grid in three-dimensional space. Geometry means this software is very **mathematically** and owns more features as follows for generating awesome structures.

- **Basic Geometry** : Sphere, circle, cylinder, torus, line and more.
- **Lindenmayer system** (**L-System**) : A parallel rewriting system. The recursive nature of the L-system rules leads to self-similarity and thereby, fractal-like forms are easy to describe with an L-system.
- **Turtle Graphic** : Full features and extensions of turtle graphics.
- **Functional Style** : Voxel Geometry includes a powerful simple JavaScript functional-programming tool-set named [Pure Eval](https://github.com/PureEval/PureEval.git). This enables you to compose function together to construct more complex structure.
- **Transformer** : Transforming space into another by pipe, compose, scale, diffusion and more.
- **Expression drawing** : Constructing from math expression or parametric equation.
- **Canvas API** : Javascript browser graphics API support.
- **Linear and Nonlinear Transform** : Mapping space into another one.
- **Diffusion Limited Aggression** : Simulating particles undergoing a random walk due to Brownian motion cluster together to form aggregates of such particles.
- **Web Viewer** : Test geometric function efficiently.
- **Chaos Theory** : Iterated Function System which uses Chaos Game.

## Screenshots

Check the [gallery folder](./gallery/README.md) for more information.

## Installation

For users , just simply download the mcpack file from the releases page (Not done yet).

- Clone the repository:

  ```bash
  git clone --recursive https://github.com/CAIMEOX/VoxelGeometry.git
  ```

- Make sure that you have nodejs and gulp installed.

  ```bash
  gulp build # Build and Load testing file for VG Viewer
  gulp # Build and deploy (Only works on windows)
  ```

## Web Viewer (For developer)

Voxel Geometry Viewer (A web viewer base on [three.js](https://threejs.org/)) enables you more conveniently and efficiently debug geometric functions.

To run it, please ensure the following two program installed:

- Node.js LTS
- TypeScript and gulp

Next, you can enter `gulp build` in the project root directory to construct the Voxel Geometry (This automatically loads the tests).

Then, enter the test folder and perform the following operations:

```bash
npm i
node server.js # Here is console and the server of web page.
npm run web # Web page runs on https://localhost:16384.
```

You can normally use various functions in the Web Viewer without using `polt`. In particular, you can also use command `clear` to clear the placed blocks.

## Basic Concepts

### Console

The **chat** window in the game is the **console**, you can use it to interact with Voxel Geometry. VG commands start with **-** , which supports JavaScript grammar. (We will ignore this flag in the following document.)

### Space

Many Voxel Geometry functions will return a **Space** (A array of 3D vectors, or Block Location).

### Grammar

Voxel Geometry supports data types like functions, arrays, numbers, strings and more. You can do everything through the combination of some basic functions.

#### Function Apply

```javascript
function(arg1, arg2, ...)
```

#### Variable

Define a var:

```javascript
let name = value;
```

## Effect

Most function in Voxel Geometry is pure function (A function has no side effects), which means it **can not** do anything on Minecraft world. Only a part of function has the ability to affect the Minecraft world.

### Plot

Most functions return Space, but this wont affect the world, you should use the function **plot** to "map" the Space into Minecraft world.

```javascript
plot(Space)
plot(sphere(5, 4)) # Generate a hollow sphere
```

### Get Position

Use the function **getpos** can get player's position and set it as the mapping **origin** of the **plot**.

### Brush

Function `brush` takes a space as argument and it will _map_ this space to the location where are looking at while you right click with a **stick**.

```javascript
brush(sphere(5, 1));
// Empty argument if you want to disable this function
place();
```

### Place Mode

Function `place` takes a space as argument and it will _map_ this space to the location where you place a block.

```javascript
place(sphere(5, 4));
// Empty argument if you want to disable this function
place();
```

### Console

If you are tired with using the chat window to execute your command. You can hold a **blaze rod** and right click to open the console (For long script this is useful)

## Basic Geometry

### Sphere

Create a sphere with radius.

```haskell
sphere :: (radius, inner_radius) -> Space
plot(sphere(5, 4))
```

### Circle

Create a circle with radius.

```haskell
circle :: (radius, inner_radius) -> Space
plot(circle(5, 4))
```

### Torus

Create a torus.

```haskell
torus :: (radius, ring_radius) -> Space
plot(torus(10,8))
```

## Transformer

### scale

Scale up a Space

```haskell
scale :: (Space, size) -> Space
```

### swap

Change the direction of a space.

```haskell
swap :: (Space, number, number) -> Space
```

### pipe

Take the point of the previous space as the origin of the next space.

```haskell
pipe :: (Space_1, Space_2, ...) -> Space
```

### diffusion

Spread out points of a space by a factor.

```haskell
diffusion :: (Space, factor) -> Space
```

### move

Move a space into a specific point.

```haskell
move :: (Space, x, y, z) -> Space
```

### embed

Embed a space into another space

```haskell
embed :: (Space, Space) -> Space
```

### Array Generator

Construct a discrete set of points.

```haskell
array_gen :: (xn, yn, zn, dx, dy, dz) -> Space
```

- \_n : Count
- d\_ : Interval

With step function:

```haskell
array_gen_fn :: (xn, yn, zn, num -> num, num -> num, num -> num) -> Space
```

## Turtle

### Turtle2D

Turtle graphics are vector graphics using a relative cursor (the "turtle") upon a Cartesian plane (x and y axis).

Voxel Geometry supports basic functions of turtle graphics:

```javascript
// Draw a straight with length 10
const t = new Turtle2D();
t.forward(10);
plot(t.getTrack());
```

### Turtle3D

Same as Turtle2D but lives in 3D space.

## L-System

An L-system or Lindenmayer system is a parallel rewriting system and a type of formal grammar.It consists of an **alphabet**, a collection of **production rules** that expand each symbol into some larger string of symbols, an initial "**axiom**" string from which to begin construction, and a **mechanism** (Such as Turtle Graphics) for translating the generated strings into geometric structures.

In Voxel Geometry, you can use this function to create a Bracketed L-system:

```haskell
lsystem :: (axiom, Rules, generation) -> Space
```

For instance, we can create Peano curve by using l-system.

```javascript
lsystem(
  "X",
  {
    X: "XFYFX+F+YFXFY-F-XFYFX",
    Y: "YFXFY-F-XFYFX+F+YFXFY",
  },
  5
);
```

Voxel Geometry uses Turtle Graphics as default mechanism.

## Canvas

Voxel geometry supports a part of Canvas API in browser.

## Math Interpreter

### Parametric Equation

Parametric equations are commonly used to express the coordinates of the points that make up a geometric object such as a curve or surface. It includes group of quantities as functions of one or more independent variables called **parameters**.

For instance, we could write down the Parametric equations of ellipse. (t is the parameter, which varies from 0 to 2\*Pi)

```javascript
// a and b are constants
x = a * cos(t);
y = b * sin(t);
```

Express this in Voxel Geometry (step represent the changing value of the parameter):

```javascript
let step = 0.1;
plot(simple_parametric("5*Math.cos(t)", "0", "10*Math.sin(t)", ["t", 0, Math.PI * 2, step]));
```

### Expression

Takes a math expression (Such as inequality) as a condition and intervals, construct a space satisfies this:

```haskell
simple_equation :: (Expr, start, end, step) -> Space
```

For instance we can construct a sphere:

```javascript
plot(simple_equation("x*x+y*y+z*z<=5", -5, 5, 1));
```

## Diffusion Limited Aggression

Simulating particles undergoing a random walk due to Brownian motion cluster together to form aggregates of such particles.

### DLA2D

```haskell
DLA2D :: (width, maxWalk, iterations, stepLength, temperature, stuckSpace = centerPoint) -> Space
```

- width : Width of operation space.
- maxWalk : Maximum number of particles that can exist simultaneously.
- iterations : Determine how many times before each particle supplement.
- stepLength : Step size of particles.
- temperature : The temperature of the iterative system will gradually decrease, which is related to the number of subsequent replenishment points.
- stuckSpace : A collection of particles that have been fixed at the beginning.

### DLA3D

Same as DLA2D but lives in 3D space.

```haskell
DLA3D :: (width, maxWalk, iterations, stepLength, temperature, stuckSpace = centerPoint) -> Space
```

## Iterated Function System

An iterated function system is a finite set of mappings on a complete metric space. Iterated function systems (IFSs) are a method of constructing **fractals**.

Voxel Geometry uses the classic algorithm named **Chaos Game** to compute IFS fractals.

Voxel Geometry uses the representation introduced in [this website](https://cs.lmu.edu/~ray/notes/ifs/)

By convention an IFS is written in rows of numbers in the form :

```
a    b    c    d    e    f    p
```

which describes the transform `λ(x,y).(ax+by+e,cx+dy+f)`. The value p represents the percentage of the fractal's area generated by the transform. Theoretically it is not required but if you select it well, the fractal is drawn much more efficiently.

```haskell
create_IFS :: (form, width, height) -> IFS
```

Here is a classic to try:

```javascript
// Create an IFS with Fractals.angle, 100000 iteration
plot(create_IFS(Fractals.angle, 100, 100).run(100000));
```
