
export function GuardedButton({
  blocked = false,
  disabled = false,
  tabIndex,
  onClick,
  onPointerDown,
  onKeyDown,
  children,
  ...props
}) {
  const isBlocked = Boolean(blocked);

  return (
    <button
      {...props}
      disabled={disabled}
      aria-disabled={isBlocked || undefined}
      tabIndex={isBlocked ? -1 : tabIndex}
      onClick={(event) => {
        if (isBlocked) return;
        onClick?.(event);
      }}
      onPointerDown={(event) => {
        if (isBlocked) return;
        onPointerDown?.(event);
      }}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
}
