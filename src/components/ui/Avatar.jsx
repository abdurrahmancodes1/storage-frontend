const Avatar = ({ src, fallback }) => {
  return (
    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt="Avatar" className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-slate-600">{fallback}</span>
      )}
    </div>
  );
};

export default Avatar;
