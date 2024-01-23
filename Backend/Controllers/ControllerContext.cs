﻿using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext : ControllerBase
    {
        protected AppDbContext context { get; }

        public ControllerContext(AppDbContext context) : base()
        {
            this.context = context;
        }

        protected IActionResult CheckIfBadRequest(Func<IActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);
    }
}
