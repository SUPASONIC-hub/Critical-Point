/**
 * A button that stays in the tab order while it refuses to act. It is marked
 * `aria-disabled` rather than `disabled`, so a keyboard or screen-reader user
 * can still reach it and hear why it is locked (the locked case cards say so in
 * their label). It used to take `tabIndex={-1}` as well, which removed exactly
 * the controls `aria-disabled` is there to keep reachable.
 */
export function GuardedButton({
  blocked = false,
  disabled = false,
  onClick,
  onPointerDown,
  children,
  ...props
}) {
  const isBlocked = Boolean(blocked);

  return (
    <button
      {...props}
      disabled={disabled}
      aria-disabled={isBlocked || undefined}
      onClick={(event) => {
        if (isBlocked) return;
        onClick?.(event);
      }}
      onPointerDown={(event) => {
        if (isBlocked) return;
        onPointerDown?.(event);
      }}
    >
      {children}
    </button>
  );
}
