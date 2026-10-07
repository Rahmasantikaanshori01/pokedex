export default function PageIntro({
  eyebrow,
  title,
  description,
  side,
}) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {side}
    </div>
  );
}
