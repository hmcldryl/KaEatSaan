import 'package:flutter/material.dart';
import 'dart:math' as math;

class SpinButton extends StatefulWidget {
  final double size;
  final Color color;
  final String text;
  final VoidCallback onPressed;

  const SpinButton({
    super.key,
    this.size = 120.0,
    this.color = Colors.red,
    this.text = 'SPIN',
    required this.onPressed,
  });

  @override
  State<SpinButton> createState() => _SpinButtonState();
}

class _SpinButtonState extends State<SpinButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pressAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _pressAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _controller.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  void _handleTapCancel() {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      onTap: widget.onPressed,
      child: AnimatedBuilder(
        animation: _pressAnimation,
        builder: (context, child) {
          return CustomPaint(
            size: Size(widget.size, widget.size),
            painter: _SpinButtonPainter(
              color: widget.color,
              pressProgress: _pressAnimation.value,
            ),
            child: Container(
              width: widget.size,
              height: widget.size,
              alignment: Alignment.center,
              padding: EdgeInsets.only(bottom: 4.0 * _pressAnimation.value),
              child: Text(
                widget.text,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: widget.size * 0.2,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: Colors.black.withOpacity(0.3),
                      offset: Offset(0, 1),
                      blurRadius: 2,
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _SpinButtonPainter extends CustomPainter {
  final Color color;
  final double pressProgress;

  _SpinButtonPainter({
    required this.color,
    required this.pressProgress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Shadow
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    canvas.drawCircle(
      center + Offset(0, 4 * (1 - pressProgress)),
      radius * 0.95,
      shadowPaint,
    );

    // Base color (darker shade)
    final basePaint = Paint()..color = color.darken(0.2);
    canvas.drawCircle(center + Offset(0, 2 * (1 - pressProgress)), radius, basePaint);

    // Main button color
    final buttonPaint = Paint()..color = color;
    canvas.drawCircle(center, radius * 0.95, buttonPaint);

    // Glossy highlight
    final highlightRect = Rect.fromCenter(
      center: center - Offset(0, radius * 0.2),
      width: radius * 1.6,
      height: radius,
    );

    final highlightGradient = RadialGradient(
      center: Alignment(0.0, -0.5),
      radius: 1.2,
      colors: [
        Colors.white.withOpacity(0.4 * (1 - pressProgress * 0.5)),
        Colors.white.withOpacity(0.1 * (1 - pressProgress * 0.5)),
        Colors.white.withOpacity(0.0),
      ],
      stops: const [0.0, 0.3, 1.0],
    );

    final highlightPaint = Paint()..shader = highlightGradient.createShader(highlightRect);
    canvas.drawCircle(center, radius * 0.95, highlightPaint);

    // Edge highlight
    final edgePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..color = Colors.white.withOpacity(0.2 * (1 - pressProgress * 0.5));
    canvas.drawCircle(center, radius * 0.95, edgePaint);
  }

  @override
  bool shouldRepaint(covariant _SpinButtonPainter oldDelegate) {
    return color != oldDelegate.color || pressProgress != oldDelegate.pressProgress;
  }
}

extension ColorExtension on Color {
  Color darken(double amount) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(this);
    return hsl.withLightness((hsl.lightness * (1 - amount)).clamp(0.0, 1.0)).toColor();
  }
}