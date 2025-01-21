import 'package:flutter/material.dart';
import 'dart:math';

class Wheel extends StatefulWidget {
  final List<String> items;
  final double width;
  final double height;
  final void Function(String)? onSpinComplete;

  const Wheel({
    Key? key,
    required this.items,
    this.width = 300,
    this.height = 300,
    this.onSpinComplete,
  }) : super(key: key);

  @override
  WheelState createState() => WheelState();
}

class WheelState extends State<Wheel> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _currentRotation = 0.0;
  String _selectedItem = '';

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );

    // Initialize animation with starting values
    _animation = Tween<double>(
      begin: _currentRotation,
      end: _currentRotation,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.decelerate,
    ));
  }

  void spin() {
    // Ensure we have items to spin
    if (widget.items.isEmpty) return;

    // Random number of full rotations plus a partial rotation
    final random = Random();
    final fullRotations = random.nextInt(5) + 3; // 3-7 full rotations
    final finalAngle = random.nextDouble() * 2 * pi;

    // Calculate the selected item
    final sectorAngle = 2 * pi / widget.items.length;
    final selectedIndex = ((finalAngle % (2 * pi)) / sectorAngle).floor();
    _selectedItem = widget.items[selectedIndex];

    // Create the animation
    _animation = Tween<double>(
      begin: _currentRotation,
      end: _currentRotation + (fullRotations * 2 * pi) + finalAngle,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.decelerate,
    ));

    // Listen for animation completion
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onSpinComplete?.call(_selectedItem);
      }
    });

    // Reset and start the animation
    _controller.reset();
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _animation.value,
          child: Container(
            width: widget.width,
            height: widget.height,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Stack(
              children: widget.items.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                final angle = (index / widget.items.length) * 2 * pi;

                return Transform.rotate(
                  angle: angle,
                  child: Container(
                    alignment: Alignment.topCenter,
                    child: RotatedBox(
                      quarterTurns: 3,
                      child: Text(
                        item,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}