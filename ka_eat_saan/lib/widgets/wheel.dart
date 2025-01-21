import 'package:flutter/material.dart';
import 'dart:math';
import 'dart:developer' as developer;

class Wheel extends StatefulWidget {
  final List<String> items;
  final double width;
  final double height;
  final void Function(String)? onSpinComplete;

  const Wheel({
    super.key,
    required this.items,
    this.width = 300,
    this.height = 300,
    this.onSpinComplete,
  });

  @override
  WheelState createState() => WheelState();
}

class WheelState extends State<Wheel> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _currentRotation = 0.0;
  String _selectedItem = '';
  bool get isAnimating => _controller.isAnimating;
  String get selectedItem => _selectedItem;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );

    _animation = Tween<double>(
      begin: 0,
      end: 0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.decelerate,
    ))..addListener(() {
      // Calculate current selected item during animation
      _updateSelectedItem(_animation.value);
    });
  }

  void _updateSelectedItem(double angle) {
    if (widget.items.isEmpty) return;

    // Normalize the angle to be between 0 and 2π
    double normalizedAngle = angle % (2 * pi);

    // Calculate sector size
    double sectorSize = 2 * pi / widget.items.length;

    // The pointer is at the top (π/2 position)
    // Since the wheel rotates clockwise and text is drawn from the center out,
    // we need to offset by π/2 to align with the pointer
    double adjustedAngle = (normalizedAngle + (pi / 2)) % (2 * pi);

    // Calculate the sector index
    // No need to invert the index since we're accounting for rotation in the angle
    int sectorIndex = (adjustedAngle / sectorSize).floor();

    String newSelection = widget.items[sectorIndex];

    if (newSelection != _selectedItem) {
      _selectedItem = newSelection;
      developer.log('Current selection: $_selectedItem (angle: ${(adjustedAngle * 180 / pi).toStringAsFixed(2)}°, sector: $sectorIndex/${widget.items.length})');
    }
  }

  void spin() {
    if (widget.items.isEmpty) {
      developer.log('Cannot spin: wheel has no items');
      return;
    }

    final random = Random();
    final fullRotations = random.nextInt(5) + 5; // 5-9 full rotations
    final extraAngle = random.nextDouble() * 2 * pi; // Random additional angle

    // Calculate final angle including full rotations and extra spin
    final finalAngle = (fullRotations * 2 * pi) + extraAngle;

    developer.log('Wheel starting spin');

    // Create the animation
    _animation = Tween<double>(
      begin: 0,
      end: finalAngle,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.decelerate,
    ));

    // Remove any existing listeners to prevent duplicates
    _controller.removeStatusListener(_onAnimationComplete);

    // Add the status listener
    _controller.addStatusListener(_onAnimationComplete);

    // Reset and start the animation
    _controller.reset();
    _controller.forward();
  }

  void _onAnimationComplete(AnimationStatus status) {
    if (status == AnimationStatus.completed) {
      developer.log('Wheel stopped: final selection is "$_selectedItem"');
      widget.onSpinComplete?.call(_selectedItem);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.topCenter,
      children: [
        // Wheel
        Padding(
          padding: const EdgeInsets.only(top: 20),
          child: AnimatedBuilder(
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
                        color: Colors.grey.withAlpha(128),
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
          ),
        ),
        // Top Arrow Indicator
        const Icon(
          Icons.arrow_drop_down,
          size: 40,
          color: Colors.deepOrange,
        ),
      ],
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}